const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');

function slugify(name) {
  return name.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

function createMember(name, position, category, department = 'CSE', team = '') {
  const trimmed = name.trim();
  if (!trimmed) return null;
  const slug = slugify(trimmed);
  return {
    id: uuidv4(),
    name: trimmed,
    position,
    department,
    category,
    team,
    photo: '',
    linkedin: `https://linkedin.com/in/${slug}`,
    github: `https://github.com/${slug.replace(/-/g, '')}`,
    email: `${slug.replace(/-/g, '.')}@codetroopers.club`
  };
}

function parseNames(namesStr) {
  if (!namesStr || !namesStr.trim()) return [];
  return namesStr.split(/[,，]/).map(n => n.trim()).filter(Boolean);
}

const members = [];
const seen = new Set();

function addMember(member) {
  if (!member) return;
  const key = member.name.toLowerCase();
  if (seen.has(key)) return;
  seen.add(key);
  members.push(member);
}

// Club Head
addMember(createMember('Abhishek Kini', 'Club Head', 'club-head'));

// Workbench Head
addMember(createMember('Tejas Nayak', 'Workbench Head', 'workbench-head'));

// Faculty Coordinators (from constitution references)
addMember(createMember('Mr. Deepak Rao', 'Faculty Coordinator', 'faculty-coordinator'));
addMember(createMember('Ms. Prithi', 'Faculty Coordinator', 'faculty-coordinator'));
addMember(createMember('Mr. Ragvendra G.S', 'Faculty Coordinator', 'faculty-coordinator'));

// Workbench Team
parseNames('Tejas BK, Vineeth, Navya Nayak').forEach(name => {
  addMember(createMember(name, 'Workbench Developer', 'member', 'CSE', 'Workbench Team'));
});

// PD Team 1
addMember(createMember('Ashish Prasad', 'Team Lead', 'team-lead', 'CSE', 'Project Development Team 1'));
addMember(createMember('Adarsh Devadiga', 'Co-Lead', 'co-lead', 'CSE', 'Project Development Team 1'));
parseNames('Thejas BK, Shreedhanya, Arya Asween Desai').forEach(name => {
  addMember(createMember(name, 'Developer', 'member', 'CSE', 'Project Development Team 1'));
});

// PD Team 2
addMember(createMember('Bhuvan Kumar', 'Team Lead', 'team-lead', 'CSE', 'Project Development Team 2'));
addMember(createMember('Reynol', 'Co-Lead', 'co-lead', 'CSE', 'Project Development Team 2'));
parseNames('Vineeth, Vishnu Prasad, Shrikari Bhat').forEach(name => {
  addMember(createMember(name, 'Developer', 'member', 'CSE', 'Project Development Team 2'));
});

// PD Team 3
addMember(createMember('Sakshi H.C', 'Team Lead', 'team-lead', 'CSE', 'Project Development Team 3'));
addMember(createMember('Swastik', 'Co-Lead', 'co-lead', 'CSE', 'Project Development Team 3'));
parseNames('Navya Nayak, Anushree K, Anusha S Bhat').forEach(name => {
  addMember(createMember(name, 'Developer', 'member', 'CSE', 'Project Development Team 3'));
});

// Learning & Platform Development Team
addMember(createMember('Chirashree', 'Team Lead', 'team-lead', 'CSE', 'Learning & Platform Development Team'));
addMember(createMember('Nayana K', 'Co-Lead', 'co-lead', 'CSE', 'Learning & Platform Development Team'));
parseNames('Samiksha, Ramya, Nisha, Saneeya Alkin Riza').forEach(name => {
  addMember(createMember(name, 'Contributor', 'member', 'CSE', 'Learning & Platform Development Team'));
});

// Events & Operations Team
addMember(createMember('Pratham P.M', 'Team Lead', 'team-lead', 'CSE', 'Events & Operations Team'));
addMember(createMember('Manoj', 'Co-Lead', 'co-lead', 'CSE', 'Events & Operations Team'));
parseNames('Sowjanya, Shreya, Ganavi, Nikhil Naik, Disha S Poojary').forEach(name => {
  addMember(createMember(name, 'Contributor', 'member', 'CSE', 'Events & Operations Team'));
});

// Media Team
addMember(createMember('Vijeth', 'Team Lead', 'team-lead', 'CSE', 'Media Team'));
parseNames('Sanjeeth Shetty, Vignesh Kumar').forEach(name => {
  addMember(createMember(name, 'Co-Lead', 'co-lead', 'CSE', 'Media Team'));
});
parseNames('Vishnu Prasad, Shreehari').forEach(name => {
  addMember(createMember(name, 'Contributor', 'member', 'CSE', 'Media Team'));
});

const output = { members };
fs.writeFileSync(path.join(__dirname, '..', 'data', 'team.json'), JSON.stringify(output, null, 2));
console.log(`Generated ${members.length} team members`);
