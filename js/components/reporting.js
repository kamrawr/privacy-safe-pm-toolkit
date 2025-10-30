// Reporting Component
const Reporting = {
    render() {
        const grid = Utils.el('div', { className: 'grid' });
        
        const card = Utils.section('Build De-Identified Report');
        
        const intro = Utils.el('p', { className: 'muted' });
        intro.innerHTML = 'Select fields for export. <strong>Names, phones, emails are automatically excluded.</strong>';
        card.appendChild(intro);
        
        // Field selection
        const fieldGroup = Utils.el('div', { 
            id: 'fieldPills',
            style: 'display:flex;gap:0.5rem;flex-wrap:wrap;margin:1rem 0'
        });
        
        const selectable = Storage.data.inventory.fields.filter(f => 
            f.collect && 
            !f.banned && 
            !['name', 'phone', 'email'].includes(f.key)
        );
        
        selectable.forEach(field => {
            const label = Utils.el('label', { className: 'pill', style: 'cursor:pointer' });
            const checkbox = Utils.el('input', { 
                type: 'checkbox',
                checked: field.risk < 4,
                'data-key': field.key
            });
            label.appendChild(checkbox);
            label.append(' ' + field.label);
            fieldGroup.appendChild(label);
        });
        
        card.appendChild(fieldGroup);
        
        // Action buttons
        const btnRow = Utils.el('div', { style: 'display:flex;gap:0.5rem;margin-bottom:1rem' });
        
        const generateBtn = Utils.el('button', {
            className: 'btn btn-primary',
            textContent: 'Generate JSON'
        });
        generateBtn.addEventListener('click', () => this.generateReport());
        
        const downloadBtn = Utils.el('button', {
            className: 'btn btn-ghost',
            textContent: 'Download'
        });
        downloadBtn.addEventListener('click', () => this.downloadReport());
        
        btnRow.appendChild(generateBtn);
        btnRow.appendChild(downloadBtn);
        card.appendChild(btnRow);
        
        // Output
        const output = Utils.el('textarea', {
            id: 'reportOut',
            placeholder: 'Generated JSON will appear here...',
            style: 'min-height:300px;font-family:var(--font-mono);font-size:0.875rem'
        });
        card.appendChild(output);
        
        grid.appendChild(card);
        return grid;
    },
    
    generateReport() {
        const checkboxes = document.querySelectorAll('#fieldPills input[type="checkbox"]:checked');
        const selectedKeys = Array.from(checkboxes).map(cb => cb.getAttribute('data-key'));
        
        const fields = Storage.data.inventory.fields.filter(f => selectedKeys.includes(f.key));
        
        const schema = fields.map(f => ({
            key: f.key,
            label: f.label
        }));
        
        // Generate sample row
        const sampleRow = {};
        fields.forEach(f => {
            sampleRow[f.key] = Utils.getSampleValue(f.key);
        });
        
        const report = {
            schema: schema,
            rows: [sampleRow],
            metadata: {
                generated: new Date().toISOString(),
                program: Storage.data.org.name || 'Unnamed Program',
                privacy_note: 'This export contains de-identified data only. No PII included.'
            }
        };
        
        document.getElementById('reportOut').value = JSON.stringify(report, null, 2);
    },
    
    downloadReport() {
        const content = document.getElementById('reportOut').value;
        if (!content || content.trim() === '') {
            Utils.toast('Generate a report first');
            return;
        }
        
        const blob = new Blob([content], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `deidentified_report_${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
        Utils.toast('Report downloaded');
    }
};