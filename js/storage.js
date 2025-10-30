// Storage module - handles localStorage operations
const Storage = {
    key: 'privacy_safe_pm_toolkit_v2',
    
    data: {
        org: { name: '', pm: '', email: '' },
        learn: { notes: '' },
        inventory: {
            fields: [
                { key: 'name', label: 'Client full name', required: false, collect: false, risk: 3 },
                { key: 'phone', label: 'Phone number', required: false, collect: false, risk: 2 },
                { key: 'email', label: 'Email', required: false, collect: false, risk: 2 },
                { key: 'address', label: 'Service address', required: true, collect: true, risk: 2 },
                { key: 'zip', label: 'ZIP code', required: true, collect: true, risk: 1 },
                { key: 'immStatus', label: 'Immigration/citizenship status', required: false, collect: false, risk: 5, banned: true },
                { key: 'ssn', label: 'SSN/Tax ID', required: false, collect: false, risk: 5, banned: true },
                { key: 'dob', label: 'Date of birth', required: false, collect: false, risk: 3 },
                { key: 'utiAcc', label: 'Utility account number', required: false, collect: false, risk: 4 },
                { key: 'kwh', label: 'kWh saved (est.)', required: true, collect: true, risk: 1 },
                { key: 'sqft', label: 'Sq Ft', required: false, collect: true, risk: 1 },
                { key: 'structure', label: 'Structure type', required: false, collect: true, risk: 1 },
                { key: 'householdID', label: 'Anonymous Household ID', required: true, collect: true, risk: 0 }
            ]
        },
        flow: { piiLocal: true, exportAnon: true, rbac: true, retentionMonths: 18 },
        partners: [{ name: 'Example CBO', exportPII: false, trained: true }],
        matrix: {
            strategies: [
                { id: 'S1', name: 'Minimal data, de-ID exports', benefit: 4, piiRisk: 1, compliance: 5, uptake: 5 },
                { id: 'S2', name: 'Collect everything, export PII upstream', benefit: 3, piiRisk: 5, compliance: 2, uptake: 1 },
                { id: 'S3', name: 'Minimal data + local encrypted PII', benefit: 4, piiRisk: 2, compliance: 5, uptake: 4 },
                { id: 'S4', name: 'Statutory fields only; counselor attestation', benefit: 3, piiRisk: 1, compliance: 5, uptake: 5 }
            ],
            weights: { benefit: 1.2, piiRisk: -2.0, compliance: 1.0, uptake: 1.2 }
        },
        check: {
            items: [
                { t: 'No-status policy in MOUs', done: false },
                { t: 'Field inventory & cut list approved', done: false },
                { t: 'De-ID pipeline tested (no direct ids)', done: false },
                { t: 'RBAC + logs enabled', done: false },
                { t: 'PII retention schedule published', done: false },
                { t: 'Multilingual beneficiary notice live', done: false },
                { t: 'Partner annual attestation complete', done: false },
                { t: 'ICE encounter protocol trained', done: false }
            ],
            notes: ''
        },
        training: {
            modules: [
                {
                    id: 'M1',
                    title: 'Privacy 101 for Energy Programs',
                    goals: ['No-status rule', 'Data minimization', 'Two-dataset model'],
                    quiz: [
                        { q: 'Should we ever collect immigration status?', a: ['Yes, for eligibility', 'Only if funder asks', 'No, never'], correct: 2 },
                        { q: 'Where does PII live?', a: ['State repository', 'CBO local store with RBAC', 'In reports'], correct: 1 },
                        { q: 'What do exports contain?', a: ['Names + phones', 'Anonymous IDs + metrics', 'Raw intake forms'], correct: 1 }
                    ]
                },
                {
                    id: 'M2',
                    title: 'Designing De-Identified Reporting',
                    goals: ['HouseholdID generator', 'Field inventory & cut list', 'Aggregation & retention'],
                    quiz: [
                        { q: 'Direct identifiers allowed upstream?', a: ['Yes', 'No'], correct: 1 },
                        { q: 'Minimum retention for PII should be…', a: ['As long as possible', 'Short + published schedule'], correct: 1 }
                    ]
                },
                {
                    id: 'M3',
                    title: 'Partner Governance & ICE Protocol',
                    goals: ['Partner clauses', 'Annual attestations', 'Encounter protocol basics'],
                    quiz: [
                        { q: 'Partners can export PII by default?', a: ['Yes', 'No'], correct: 1 },
                        { q: 'If ICE requests data, you…', a: ['Share immediately', 'Refer to counsel + policy; no voluntary disclosure of PII'], correct: 1 }
                    ]
                }
            ],
            tracks: [
                { id: 'T1', title: 'Frontline Intake (30-min)', includes: ['M1'] },
                { id: 'T2', title: 'PM & Compliance (45-min)', includes: ['M1', 'M2'] },
                { id: 'T3', title: 'Partner Leads (60-min)', includes: ['M1', 'M2', 'M3'] }
            ]
        },
        personas: [
            { role: 'CBO Exec', wins: ['Lower legal risk', 'Clear protocols', 'Funding flow protected'], worries: ['Audit findings', 'Community trust'] },
            { role: 'Contractor', wins: ['Faster approvals', 'Less paperwork'], worries: ['Change fatigue', 'Extra steps'] },
            { role: 'State Program', wins: ['Compliant data', 'Better uptake'], worries: ['Metrics quality', 'Timeliness'] },
            { role: 'Community Member', wins: ['Privacy', 'Clarity'], worries: ['Fear of data misuse'] }
        ],
        evidence: [
            { title: 'Privacy-by-design overview', note: 'Why minimization increases uptake; use in business case.', url: '' },
            { title: 'Data protection impact assessment template', note: 'Document why each field is collected or cut.', url: '' },
            { title: 'Beneficiary notice examples', note: 'Multilingual scripts & flyers for outreach.', url: '' }
        ]
    },

    save() {
        localStorage.setItem(this.key, JSON.stringify(this.data));
    },

    load() {
        const raw = localStorage.getItem(this.key);
        if (raw) {
            try {
                this.data = JSON.parse(raw);
            } catch (e) {
                console.error('Failed to parse stored data:', e);
            }
        }
    }
};

// Load data on initialization
Storage.load();
