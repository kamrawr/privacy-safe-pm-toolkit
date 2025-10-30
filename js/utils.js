// Utility functions
const Utils = {
    // Create element with properties
    el(tag, props = {}) {
        return Object.assign(document.createElement(tag), props);
    },

    // Create pill badge
    pill(text, className = '') {
        const span = this.el('span', { className: `pill ${className}` });
        span.textContent = text;
        return span;
    },

    // Create badge
    badge(text, className = '') {
        const span = this.el('span', { className: `badge ${className}` });
        span.textContent = text;
        return span;
    },

    // Show toast notification
    toast(message, duration = 1400) {
        const toast = this.el('div', {
            className: 'toast',
            textContent: message
        });
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), duration);
    },

    // Create section card
    section(title, rightContent = null) {
        const card = this.el('div', { className: 'card' });
        const header = this.el('div', { className: 'section-header' });
        const titleEl = this.el('h2', {
            className: 'section-title',
            textContent: title
        });
        header.appendChild(titleEl);
        
        if (rightContent) {
            header.appendChild(rightContent);
        }
        
        card.appendChild(header);
        return card;
    },

    // Generate household IDs
    generateHouseholdIDs(count = 5) {
        const ids = [];
        for (let i = 0; i < count; i++) {
            const random = Math.random().toString(36).slice(2, 8).toUpperCase();
            const timestamp = Date.now().toString().slice(-5);
            ids.push(`HH-${random}-${timestamp}`);
        }
        return ids;
    },

    // Sample value for reports
    getSampleValue(key) {
        const samples = {
            householdID: 'HH-EXAMPLE-00001',
            kwh: 4200,
            zip: '97206',
            sqft: 1180,
            address: 'REDACTED',
            structure: 'Single-family'
        };
        return samples[key] || null;
    },

    // Insert beneficiary notice template
    getBeneficiaryNotice() {
        return `\n\nBENEFICIARY NOTICE (DRAFT)
• We do not ask for or record immigration or citizenship status.
• We collect only the information needed to deliver services and report results.
• Your name and contact stay with our local partner. Reports use anonymous IDs and metrics (ZIP, energy savings, etc.).
• You can ask what we collected and request deletion when services are complete (subject to warranty/QA needs).`;
    },

    // Insert contract clauses template
    getContractClauses() {
        return `\n\nCONTRACT CLAUSES (DRAFT)
1) No-Status Collection: Provider shall not request, collect, store, or infer immigration/citizenship status of participants.
2) De-Identification: Deliverables must be de-identified (program IDs + aggregated metrics). Direct identifiers (name, phone, email, exact DOB, coordinates, utility account) are prohibited.
3) Security & Retention: Provider implements RBAC, logging, encryption at rest; PII retention limited to service need; deletions per schedule.`;
    },

    // Calculate strategy score
    calculateStrategyScore(strategy, weights) {
        return (
            strategy.benefit * weights.benefit +
            strategy.piiRisk * weights.piiRisk +
            strategy.compliance * weights.compliance +
            strategy.uptake * weights.uptake
        );
    }
};
