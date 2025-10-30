// Data Flow Component
const Flow = {
    render() {
        const grid = Utils.el('div', { className: 'grid' });
        
        const design = Utils.section('Data Flow Design');
        const flowList = Utils.el('ol');
        flowList.innerHTML = `
            <li>Intake collects <strong>only</strong> necessary fields → generates <code>HouseholdID</code>.</li>
            <li>PII stored locally at CBO with RBAC + logs.</li>
            <li>Transformer produces <strong>de-identified</strong> dataset → exports metrics only.</li>
            <li>Reports aggregate impacts (ZIP, kWh, structure type).</li>
        `;
        design.appendChild(flowList);
        
        // Options and ID generator side by side
        const optionsCard = Utils.el('div', { className: 'card span6' });
        optionsCard.innerHTML = `
            <h3>Flow Options</h3>
            <div class="field-group">
                <label>
                    <input type="checkbox" id="opt_piiLocal" ${Storage.data.flow.piiLocal ? 'checked' : ''}/>
                    Keep PII local (never upstream)
                </label>
            </div>
            <div class="field-group">
                <label>
                    <input type="checkbox" id="opt_exportAnon" ${Storage.data.flow.exportAnon ? 'checked' : ''}/>
                    Exports are de-identified
                </label>
            </div>
            <div class="field-group">
                <label>
                    <input type="checkbox" id="opt_rbac" ${Storage.data.flow.rbac ? 'checked' : ''}/>
                    RBAC + access logs
                </label>
            </div>
            <div class="field-group">
                <label for="opt_ret">PII retention (months)</label>
                <input type="number" id="opt_ret" value="${Storage.data.flow.retentionMonths}" min="1" max="60"/>
            </div>
        `;
        
        optionsCard.querySelector('#opt_piiLocal').addEventListener('change', e => {
            Storage.data.flow.piiLocal = e.target.checked;
        });
        optionsCard.querySelector('#opt_exportAnon').addEventListener('change', e => {
            Storage.data.flow.exportAnon = e.target.checked;
        });
        optionsCard.querySelector('#opt_rbac').addEventListener('change', e => {
            Storage.data.flow.rbac = e.target.checked;
        });
        optionsCard.querySelector('#opt_ret').addEventListener('input', e => {
            Storage.data.flow.retentionMonths = parseInt(e.target.value || 18, 10);
        });
        
        const idCard = Utils.el('div', { className: 'card span6' });
        idCard.innerHTML = `
            <h3>Generate Household IDs</h3>
            <div style="display:flex;gap:0.5rem;margin-bottom:1rem">
                <button class="btn btn-primary" id="gen5">Generate 5</button>
                <button class="btn btn-ghost" id="copyIds">Copy IDs</button>
            </div>
            <pre id="ids" style="min-height:120px"></pre>
        `;
        
        idCard.querySelector('#gen5').addEventListener('click', () => {
            const ids = Utils.generateHouseholdIDs(5);
            document.getElementById('ids').textContent = ids.join('\n');
        });
        
        idCard.querySelector('#copyIds').addEventListener('click', () => {
            const text = document.getElementById('ids').textContent;
            if (text) {
                navigator.clipboard.writeText(text);
                Utils.toast('IDs copied to clipboard');
            }
        });
        
        // Partner settings
        const partners = Utils.section('Partner Settings');
        const partnerList = Utils.el('div', { id: 'partnerList' });
        
        this.renderPartners(partnerList);
        
        const addBtn = Utils.el('button', {
            className: 'btn btn-primary',
            textContent: '+ Add Partner',
            style: 'margin-top:1rem'
        });
        addBtn.addEventListener('click', () => {
            Storage.data.partners.push({ name: '', exportPII: false, trained: false });
            this.renderPartners(partnerList);
        });
        
        partners.appendChild(partnerList);
        partners.appendChild(addBtn);
        
        grid.appendChild(design);
        grid.appendChild(optionsCard);
        grid.appendChild(idCard);
        grid.appendChild(partners);
        
        return grid;
    },
    
    renderPartners(container) {
        container.innerHTML = '';
        
        Storage.data.partners.forEach((partner, index) => {
            const row = Utils.el('div', { 
                className: 'field-row',
                style: 'margin-bottom:1rem;align-items:flex-start;flex-wrap:wrap'
            });
            
            const nameInput = Utils.el('input', {
                type: 'text',
                placeholder: 'Partner name',
                value: partner.name,
                style: 'min-width:200px'
            });
            nameInput.addEventListener('input', e => {
                Storage.data.partners[index].name = e.target.value;
            });
            
            const checkboxes = Utils.el('div', { style: 'display:flex;flex-direction:column;gap:0.5rem' });
            
            const exportLabel = Utils.el('label');
            const exportCheck = Utils.el('input', { type: 'checkbox', checked: partner.exportPII });
            exportCheck.addEventListener('change', e => {
                Storage.data.partners[index].exportPII = e.target.checked;
            });
            exportLabel.appendChild(exportCheck);
            exportLabel.append(' Allow PII export (discouraged)');
            
            const trainedLabel = Utils.el('label');
            const trainedCheck = Utils.el('input', { type: 'checkbox', checked: partner.trained });
            trainedCheck.addEventListener('change', e => {
                Storage.data.partners[index].trained = e.target.checked;
            });
            trainedLabel.appendChild(trainedCheck);
            trainedLabel.append(' Staff trained on privacy + ICE protocol');
            
            checkboxes.appendChild(exportLabel);
            checkboxes.appendChild(trainedLabel);
            
            const removeBtn = Utils.el('button', {
                className: 'btn btn-danger',
                textContent: 'Remove'
            });
            removeBtn.addEventListener('click', () => {
                Storage.data.partners.splice(index, 1);
                this.renderPartners(container);
            });
            
            row.appendChild(nameInput);
            row.appendChild(checkboxes);
            row.appendChild(removeBtn);
            container.appendChild(row);
        });
    }
};