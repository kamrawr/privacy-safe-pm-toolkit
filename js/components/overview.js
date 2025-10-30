// Overview Component
const Overview = {
    render() {
        const grid = Utils.el('div', { className: 'grid' });
        
        // Program Posture
        const posture = Utils.section('Program Posture');
        const intro = Utils.el('p');
        intro.innerHTML = '<strong>Goal:</strong> Protect households while meeting funder reporting. Keep <strong>PII local</strong>, export <strong>de-identified metrics</strong>, train partners, and document controls.';
        posture.appendChild(intro);

        // Organization Info Card
        const orgCard = Utils.el('div', { className: 'card span6' });
        orgCard.innerHTML = `
            <div class="field-group">
                <label for="org_name">Organization</label>
                <input type="text" id="org_name" value="${Storage.data.org.name || ''}" 
                       placeholder="Community Partner Funding – Residential"/>
            </div>
            <div class="field-group">
                <label for="org_pm">Program Manager</label>
                <input type="text" id="org_pm" value="${Storage.data.org.pm || ''}" 
                       placeholder="Your name"/>
            </div>
            <div class="field-group">
                <label for="org_email">Contact Email</label>
                <input type="email" id="org_email" value="${Storage.data.org.email || ''}" 
                       placeholder="name@example.org"/>
            </div>
            <div style="display:flex;gap:0.5rem;margin-top:1rem;flex-wrap:wrap">
                ${Utils.pill('PII stays local', 'pill-success').outerHTML}
                ${Utils.pill('Exports = metrics only').outerHTML}
                ${Utils.pill('Short retention', 'pill-warning').outerHTML}
            </div>
        `;
        
        // Add event listeners
        orgCard.querySelector('#org_name').addEventListener('input', e => {
            Storage.data.org.name = e.target.value;
        });
        orgCard.querySelector('#org_pm').addEventListener('input', e => {
            Storage.data.org.pm = e.target.value;
        });
        orgCard.querySelector('#org_email').addEventListener('input', e => {
            Storage.data.org.email = e.target.value;
        });

        // Settings Card
        const settingsCard = Utils.el('div', { className: 'card span6' });
        settingsCard.innerHTML = `
            <h3>Settings</h3>
            <div class="field-group">
                <label>
                    <input type="checkbox" id="piiLocal" ${Storage.data.flow.piiLocal ? 'checked' : ''}/>
                    Keep all PII local at CBO
                </label>
            </div>
            <div class="field-group">
                <label>
                    <input type="checkbox" id="exportAnon" ${Storage.data.flow.exportAnon ? 'checked' : ''}/>
                    Export anonymous HouseholdID + metrics
                </label>
            </div>
            <div class="field-group">
                <label>
                    <input type="checkbox" id="rbac" ${Storage.data.flow.rbac ? 'checked' : ''}/>
                    Role-based access + logs
                </label>
            </div>
            <div class="field-group">
                <label for="retention">PII retention (months)</label>
                <input type="number" id="retention" min="1" max="60" 
                       value="${Storage.data.flow.retentionMonths}"/>
                <small class="hint">Keep 12–24 months unless warranty/QA requires more.</small>
            </div>
        `;
        
        settingsCard.querySelector('#piiLocal').addEventListener('change', e => {
            Storage.data.flow.piiLocal = e.target.checked;
        });
        settingsCard.querySelector('#exportAnon').addEventListener('change', e => {
            Storage.data.flow.exportAnon = e.target.checked;
        });
        settingsCard.querySelector('#rbac').addEventListener('change', e => {
            Storage.data.flow.rbac = e.target.checked;
        });
        settingsCard.querySelector('#retention').addEventListener('input', e => {
            Storage.data.flow.retentionMonths = parseInt(e.target.value || 18, 10);
        });

        // Legend
        const legend = Utils.section('Risk Legend');
        legend.innerHTML += `
            <div style="display:flex;gap:0.5rem;flex-wrap:wrap">
                ${Utils.pill('Low Risk', 'pill-success').outerHTML}
                ${Utils.pill('Caution', 'pill-warning').outerHTML}
                ${Utils.pill('High Risk', 'pill-danger').outerHTML}
                ${Utils.pill('Banned = do not collect').outerHTML}
            </div>
        `;

        // Append to grid
        grid.appendChild(posture);
        grid.appendChild(orgCard);
        grid.appendChild(settingsCard);
        grid.appendChild(legend);

        return grid;
    }
};
