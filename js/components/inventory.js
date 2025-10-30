// Field Inventory Component
const Inventory = {
    render() {
        const grid = Utils.el('div', { className: 'grid' });
        
        const card = Utils.section('Field Inventory');
        const intro = Utils.el('p', { className: 'muted' });
        intro.textContent = 'Toggle data collection for each field. Mark risk level (0-5). Banned fields should never be collected.';
        card.appendChild(intro);
        
        const table = Utils.el('table');
        table.innerHTML = `
            <thead>
                <tr>
                    <th>Field</th>
                    <th style="text-align:center">Collect?</th>
                    <th style="text-align:center">Required?</th>
                    <th>Risk (0-5)</th>
                    <th>Status</th>
                </tr>
            </thead>
        `;
        
        const tbody = Utils.el('tbody');
        Storage.data.inventory.fields.forEach((field, index) => {
            const tr = Utils.el('tr');
            
            const tdLabel = Utils.el('td');
            tdLabel.innerHTML = `<strong>${field.label}</strong>`;
            
            const tdCollect = Utils.el('td', { style: 'text-align:center' });
            const checkCollect = Utils.el('input', { 
                type: 'checkbox', 
                checked: field.collect,
                disabled: field.banned
            });
            checkCollect.addEventListener('change', e => {
                if (field.banned && e.target.checked) {
                    e.target.checked = false;
                    Utils.toast('This field is banned and cannot be collected');
                    return;
                }
                Storage.data.inventory.fields[index].collect = e.target.checked;
                this.updateRiskDisplay();
            });
            tdCollect.appendChild(checkCollect);
            
            const tdRequired = Utils.el('td', { style: 'text-align:center' });
            const checkRequired = Utils.el('input', { 
                type: 'checkbox', 
                checked: field.required
            });
            checkRequired.addEventListener('change', e => {
                Storage.data.inventory.fields[index].required = e.target.checked;
            });
            tdRequired.appendChild(checkRequired);
            
            const tdRisk = Utils.el('td');
            const inputRisk = Utils.el('input', {
                type: 'number',
                min: 0,
                max: 5,
                value: field.risk,
                style: 'width:80px'
            });
            inputRisk.addEventListener('input', e => {
                const val = parseInt(e.target.value) || 0;
                Storage.data.inventory.fields[index].risk = Math.min(5, Math.max(0, val));
                this.updateRiskDisplay();
            });
            tdRisk.appendChild(inputRisk);
            
            const tdStatus = Utils.el('td');
            let statusBadge;
            if (field.banned) {
                statusBadge = Utils.pill('BANNED', 'pill-danger');
            } else if (field.risk >= 4) {
                statusBadge = Utils.pill('High Risk', 'pill-warning');
            } else if (field.risk >= 2) {
                statusBadge = Utils.pill('Medium', 'pill-warning');
            } else {
                statusBadge = Utils.pill('Low Risk', 'pill-success');
            }
            tdStatus.appendChild(statusBadge);
            
            tr.append(tdLabel, tdCollect, tdRequired, tdRisk, tdStatus);
            tbody.appendChild(tr);
        });
        
        table.appendChild(tbody);
        card.appendChild(table);
        
        // Risk summary
        const summary = Utils.section('Risk Snapshot');
        const summaryDiv = Utils.el('div', { 
            id: 'riskSummary',
            style: 'display:flex;gap:1rem;align-items:center;flex-wrap:wrap'
        });
        summary.appendChild(summaryDiv);
        
        const presetBtn = Utils.el('button', {
            className: 'btn btn-ghost',
            textContent: 'Apply Safe Preset',
            style: 'margin-left:auto'
        });
        presetBtn.addEventListener('click', () => this.applySafePreset());
        summaryDiv.appendChild(presetBtn);
        
        grid.appendChild(card);
        grid.appendChild(summary);
        
        setTimeout(() => this.updateRiskDisplay(), 0);
        
        return grid;
    },
    
    updateRiskDisplay() {
        const summaryDiv = document.getElementById('riskSummary');
        if (!summaryDiv) return;
        
        const collected = Storage.data.inventory.fields.filter(f => f.collect);
        const totalRisk = collected.reduce((sum, f) => sum + f.risk, 0);
        const highRisk = collected.filter(f => f.banned || f.risk >= 4).length;
        
        let riskClass = 'pill-success';
        if (totalRisk > 8) riskClass = 'pill-danger';
        else if (totalRisk > 3) riskClass = 'pill-warning';
        
        summaryDiv.innerHTML = `
            ${Utils.pill(`Aggregate Risk: ${totalRisk}`, riskClass).outerHTML}
            ${Utils.pill(`High-risk fields: ${highRisk}`, highRisk > 0 ? 'pill-warning' : 'pill-success').outerHTML}
            ${Utils.pill(`Total fields collected: ${collected.length}`).outerHTML}
        `;
        
        // Re-add button
        const presetBtn = Utils.el('button', {
            className: 'btn btn-ghost',
            textContent: 'Apply Safe Preset',
            style: 'margin-left:auto'
        });
        presetBtn.addEventListener('click', () => this.applySafePreset());
        summaryDiv.appendChild(presetBtn);
    },
    
    applySafePreset() {
        Storage.data.inventory.fields.forEach(field => {
            if (field.banned) {
                field.collect = false;
                field.required = false;
            } else if (['name', 'phone', 'email', 'dob', 'utiAcc', 'ssn', 'immStatus'].includes(field.key)) {
                field.collect = false;
            } else if (['zip', 'address', 'kwh', 'householdID'].includes(field.key)) {
                field.collect = true;
                field.required = true;
            }
        });
        App.render();
        Utils.toast('Applied safe preset');
    }
};