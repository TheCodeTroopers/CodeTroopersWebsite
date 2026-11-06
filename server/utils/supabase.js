const { createClient } = require('@supabase/supabase-js');
const path = require('path');
const { readJSON, writeJSON } = require('./jsonStore');
const { v4: uuidv4 } = require('uuid');

require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 
                     process.env.SUPABASE_KEY || 
                     process.env.SUPABASE_ANON_KEY;

let supabaseInstance = null;

function getSupabaseClient() {
  if (supabaseInstance) return supabaseInstance;

  if (SUPABASE_URL && SUPABASE_KEY) {
    try {
      supabaseInstance = createClient(SUPABASE_URL, SUPABASE_KEY, {
        auth: {
          persistSession: false,
          autoRefreshToken: false
        }
      });
      return supabaseInstance;
    } catch (err) {
      console.warn('Failed to initialize Supabase client:', err.message);
      return null;
    }
  }

  return null;
}

function isSupabaseConfigured() {
  return Boolean(SUPABASE_URL && SUPABASE_KEY && getSupabaseClient());
}

/**
 * Normalizes an application record to guarantee both camelCase and snake_case properties
 * so the frontend Admin Dashboard and all existing clients receive complete, uniform data.
 */
function normalizeApplication(record) {
  if (!record) return null;

  const id = String(record.id || record._id || record.application_id || '');
  const fullName = record.fullName || record.full_name || record.name || '';
  const email = record.collegeEmail || record.college_email || record.email || '';
  const phone = record.phone || record.phone_number || '';
  const usn = record.usn || '';
  const semester = record.semester || record.year || '';
  const branch = record.branch || record.department || '';
  const skillsExperience = record.skillsExperience || record.skills_experience || record.skills || '';
  const motivation = record.motivation || record.whyJoin || record.why_join || '';
  const github = record.github || '';
  const linkedin = record.linkedin || '';
  const portfolio = record.portfolio || '';

  let resumeUrl = record.resumeUrl || record.resume_url || '';
  let resume = record.resume;
  if (!resumeUrl && typeof resume === 'string') {
    resumeUrl = resume;
  } else if (!resumeUrl && resume && typeof resume === 'object') {
    resumeUrl = resume.driveViewLink || resume.webViewLink || '';
  }

  if (!resume && resumeUrl) {
    resume = {
      driveViewLink: resumeUrl,
      webViewLink: resumeUrl,
      fileName: `${fullName.replace(/\s+/g, '_')}_Resume.pdf`
    };
  }

  let domains = record.domains;
  if (!domains) {
    domains = record.domain ? [record.domain] : ['General Track'];
  } else if (typeof domains === 'string') {
    try {
      const parsed = JSON.parse(domains);
      domains = Array.isArray(parsed) ? parsed : [domains];
    } catch {
      domains = domains.split(',').map(s => s.trim()).filter(Boolean);
    }
  }

  const status = (record.status || 'pending').toLowerCase();
  const appliedAt = record.appliedAt || record.applied_at || record.created_at || record.createdAt || record.submittedAt || new Date().toISOString();
  const updatedAt = record.updatedAt || record.updated_at || appliedAt;

  return {
    ...record,
    id,
    fullName,
    full_name: fullName,
    name: fullName,
    email,
    collegeEmail: email,
    college_email: email,
    phone,
    phone_number: phone,
    usn,
    branch,
    department: branch,
    semester,
    domains,
    skills: skillsExperience,
    skillsExperience,
    skills_experience: skillsExperience,
    github,
    linkedin,
    portfolio,
    motivation,
    whyJoin: motivation,
    why_join: motivation,
    resume,
    resumeUrl,
    resume_url: resumeUrl,
    status,
    appliedAt,
    applied_at: appliedAt,
    created_at: appliedAt,
    createdAt: appliedAt,
    submittedAt: appliedAt,
    updatedAt,
    updated_at: updatedAt
  };
}

/**
 * Resiliently inserts a record into Supabase. If Supabase rejects unknown columns,
 * it prunes the offending column and retries, ensuring compatibility with any schema variation.
 */
async function resilientInsert(supabase, table, payload) {
  let record = { ...payload };

  for (let attempt = 0; attempt < 8; attempt++) {
    const { data, error } = await supabase
      .from(table)
      .insert([record])
      .select();

    if (!error) {
      return { data: data ? data[0] : record, error: null };
    }

    // Check if error is due to missing column in PostgreSQL / PostgREST schema cache
    const match = error.message && error.message.match(/Could not find the '([^']+)' column/i);
    if (match && match[1] && record.hasOwnProperty(match[1])) {
      delete record[match[1]];
      continue;
    }

    // Other errors (e.g. table not found or connection issue)
    return { data: null, error };
  }

  return { data: null, error: new Error('Failed to insert record after column pruning') };
}

/**
 * Read applications from JSON fallback store
 */
async function readApplicationsFromJSON() {
  try {
    const raw = await readJSON('applications.json');
    const apps = Array.isArray(raw) ? raw : (raw.applications ? raw.applications : []);
    return apps.map(normalizeApplication);
  } catch {
    return [];
  }
}

/**
 * Write applications to JSON fallback store
 */
async function writeApplicationsToJSON(applications) {
  try {
    await writeJSON('applications.json', applications);
  } catch (err) {
    console.error('Failed to sync applications to JSON store:', err.message);
  }
}

/**
 * Fetch all applications, querying Supabase when configured with JSON fallback
 */
async function fetchAllApplications({ status, domain, search } = {}) {
  let applications = [];
  let fetchedFromSupabase = false;

  if (isSupabaseConfigured()) {
    try {
      const supabase = getSupabaseClient();
      let query = supabase.from('applications').select('*');

      if (status && status !== 'all') {
        query = query.ilike('status', status);
      }

      const { data, error } = await query;
      if (!error && Array.isArray(data)) {
        applications = data.map(normalizeApplication);
        fetchedFromSupabase = true;
      } else if (error) {
        console.warn('Supabase fetch error, falling back to JSON:', error.message);
      }
    } catch (err) {
      console.warn('Supabase query error, falling back to JSON:', err.message);
    }
  }

  if (!fetchedFromSupabase) {
    applications = await readApplicationsFromJSON();
    if (status && status !== 'all') {
      applications = applications.filter(a => a.status?.toLowerCase() === status.toLowerCase());
    }
  }

  if (domain && domain !== 'all') {
    applications = applications.filter(a => {
      if (Array.isArray(a.domains)) {
        return a.domains.some(d => d.toLowerCase().includes(domain.toLowerCase()));
      }
      return typeof a.domain === 'string' && a.domain.toLowerCase().includes(domain.toLowerCase());
    });
  }

  if (search) {
    const q = search.toLowerCase();
    applications = applications.filter(a =>
      (a.name && a.name.toLowerCase().includes(q)) ||
      (a.fullName && a.fullName.toLowerCase().includes(q)) ||
      (a.email && a.email.toLowerCase().includes(q)) ||
      (a.collegeEmail && a.collegeEmail.toLowerCase().includes(q)) ||
      (a.usn && a.usn.toLowerCase().includes(q)) ||
      (a.branch && a.branch.toLowerCase().includes(q)) ||
      (a.skills && a.skills.toLowerCase().includes(q)) ||
      (a.skillsExperience && a.skillsExperience.toLowerCase().includes(q))
    );
  }

  // Sort by most recent application first
  applications.sort((a, b) => new Date(b.appliedAt || 0) - new Date(a.appliedAt || 0));

  return applications;
}

/**
 * Fetch a single application by ID
 */
async function fetchApplicationById(id) {
  if (isSupabaseConfigured()) {
    try {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .or(`id.eq.${id},usn.eq.${id}`)
        .maybeSingle();

      if (!error && data) {
        return normalizeApplication(data);
      }
    } catch (err) {
      console.warn('Supabase fetchById error, falling back to JSON:', err.message);
    }
  }

  const applications = await readApplicationsFromJSON();
  return applications.find(a => a.id === id || a._id === id || a.application_id === id) || null;
}

/**
 * Update application status
 */
async function updateApplicationStatus(id, newStatus) {
  const statusLower = newStatus.toLowerCase();
  const updatedAt = new Date().toISOString();
  let updatedRecord = null;

  if (isSupabaseConfigured()) {
    try {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase
        .from('applications')
        .update({
          status: statusLower,
          updated_at: updatedAt
        })
        .eq('id', id)
        .select();

      if (!error && data && data.length > 0) {
        updatedRecord = normalizeApplication(data[0]);
      }
    } catch (err) {
      console.warn('Supabase updateStatus error:', err.message);
    }
  }

  // Always sync with JSON store for redundancy and offline compatibility
  const applications = await readApplicationsFromJSON();
  const index = applications.findIndex(a => a.id === id || a._id === id || a.application_id === id);
  if (index !== -1) {
    applications[index].status = statusLower;
    applications[index].updatedAt = updatedAt;
    applications[index].updated_at = updatedAt;
    await writeApplicationsToJSON(applications);
    if (!updatedRecord) {
      updatedRecord = applications[index];
    }
  }

  return updatedRecord;
}

/**
 * Delete an application record
 */
async function deleteApplication(id) {
  let removed = null;

  if (isSupabaseConfigured()) {
    try {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase
        .from('applications')
        .delete()
        .eq('id', id)
        .select();

      if (!error && data && data.length > 0) {
        removed = normalizeApplication(data[0]);
      }
    } catch (err) {
      console.warn('Supabase delete error:', err.message);
    }
  }

  const applications = await readApplicationsFromJSON();
  const index = applications.findIndex(a => a.id === id || a._id === id || a.application_id === id);
  if (index !== -1) {
    const deleted = applications.splice(index, 1)[0];
    await writeApplicationsToJSON(applications);
    if (!removed) removed = deleted;
  }

  return removed;
}

/**
 * Save new application (from public Join Us form)
 */
async function saveApplication(formData, driveFile, originalFile) {
  const id = uuidv4();
  const now = new Date().toISOString();

  const resumeUrl = driveFile?.webViewLink || 
    (driveFile?.id ? `https://drive.google.com/file/d/${driveFile.id}/view?usp=sharing` : '');

  const resumeMetadata = {
    fileName: driveFile?.name || `${formData.fullName || 'Applicant'}_Resume.pdf`,
    driveFileId: driveFile?.id || '',
    driveViewLink: resumeUrl,
    originalName: originalFile?.originalname || 'resume.pdf',
    size: originalFile?.size || 0
  };

  const normalizedRecord = normalizeApplication({
    id,
    fullName: formData.fullName,
    usn: formData.usn,
    semester: formData.semester,
    collegeEmail: formData.collegeEmail,
    phone: formData.phone,
    skillsExperience: formData.skillsExperience,
    github: formData.github || '',
    linkedin: formData.linkedin || '',
    motivation: formData.motivation || '',
    resume: resumeMetadata,
    resumeUrl: resumeUrl,
    resume_url: resumeUrl,
    status: 'pending',
    appliedAt: now,
    submittedAt: now
  });

  let savedInSupabase = false;

  if (isSupabaseConfigured()) {
    try {
      const supabase = getSupabaseClient();
      
      // Candidate payload containing both snake_case and standard fields for resilient insert
      const supabasePayload = {
        id,
        full_name: formData.fullName,
        fullName: formData.fullName,
        college_email: formData.collegeEmail,
        collegeEmail: formData.collegeEmail,
        usn: formData.usn,
        phone: formData.phone,
        semester: formData.semester,
        skills_experience: formData.skillsExperience,
        skillsExperience: formData.skillsExperience,
        github: formData.github || null,
        linkedin: formData.linkedin || null,
        motivation: formData.motivation || null,
        resume_url: resumeUrl,
        resumeUrl: resumeUrl,
        resume_file_id: driveFile?.id || null,
        resume_metadata: resumeMetadata,
        status: 'pending',
        applied_at: now,
        created_at: now,
        updated_at: now
      };

      const { data, error } = await resilientInsert(supabase, 'applications', supabasePayload);
      if (!error) {
        savedInSupabase = true;
      } else {
        console.warn('Failed to insert into Supabase, saving to JSON fallback:', error.message);
      }
    } catch (err) {
      console.warn('Supabase save error:', err.message);
    }
  }

  // Always keep JSON fallback updated
  const applications = await readApplicationsFromJSON();
  applications.unshift(normalizedRecord);
  await writeApplicationsToJSON(applications);

  return {
    application: normalizedRecord,
    savedInSupabase
  };
}

/**
 * Calculate recruitment statistics
 */
async function calculateStats() {
  const applications = await fetchAllApplications();

  return {
    total: applications.length,
    pending: applications.filter(a => (a.status || 'pending').toLowerCase() === 'pending').length,
    reviewing: applications.filter(a => a.status?.toLowerCase() === 'reviewing').length,
    shortlisted: applications.filter(a => a.status?.toLowerCase() === 'shortlisted').length,
    accepted: applications.filter(a => a.status?.toLowerCase() === 'accepted').length,
    rejected: applications.filter(a => a.status?.toLowerCase() === 'rejected').length
  };
}

module.exports = {
  getSupabaseClient,
  isSupabaseConfigured,
  normalizeApplication,
  fetchAllApplications,
  fetchApplicationById,
  updateApplicationStatus,
  deleteApplication,
  saveApplication,
  calculateStats
};

