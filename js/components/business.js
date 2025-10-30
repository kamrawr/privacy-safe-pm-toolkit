// Business Case Component
const Business = {
    render() {
        const grid = Utils.el('div', { className: 'grid' });
        
        // Benefits card
        const benefits = Utils.section('Why This Model Wins');
        const benefitsList = Utils.el('ul');
        benefitsList.innerHTML = `
            <li><strong>Equity & trust:</strong> Fewer sensitive questions → higher participation, especially for mixed-status households.</li>
            <li><strong>Compliance by design:</strong> Exports meet reporting needs without PII exposure.</li>
            <li><strong>Operational speed:</strong> Standard fields + clear cut list = faster intake & fewer errors.</li>
            <li><strong>Lower audit risk:</strong> Short retention + RBAC reduce breach exposure and fixes.</li>
            <li><strong>Program outcomes:</strong> More completed projects, less attrition at intake.</li>
        `;
        benefits.appendChild(benefitsList);
        
        // ROI calculator
        const roi = Utils.section('Back-of-the-Envelope ROI');
        const calcForm = Utils.el('div', { className: 'field-row', style: 'flex-wrap:wrap;margin-bottom:1rem' });
        calcForm.innerHTML = `
            <div class="field-group" style="min-width:180px">
                <label for="hhs">Households / yr</label>
                <input type="number" id="hhs" value="300"/>
            </div>
            <div class="field-group" style="min-width:180px">
                <label for="drop">Drop-off reduction (%)</label>
                <input type="number" id="drop" value="12"/>
            </div>
            <div class="field-group" style="min-width:200px">
                <label for="val">Avg value per completion ($)</label>
                <input type="number" id="val" value="3500"/>
            </div>
            <button class="btn btn-primary" id="calcBtn" style="align-self:flex-end">Calculate</button>
        `;
        roi.appendChild(calcForm);
        
        const results = Utils.el('div', { 
            id: 'roiResults', 
            className: 'alert alert-success',
            style: 'display:none'
        });
        roi.appendChild(results);
        
        roi.querySelector('#calcBtn').addEventListener('click', () => {
            const hh = parseInt(document.getElementById('hhs').value) || 0;
            const drop = parseInt(document.getElementById('drop').value) || 0;
            const val = parseInt(document.getElementById('val').value) || 0;
            const additional = Math.round(hh * (drop / 100));
            const gain = additional * val;
            
            results.style.display = 'block';
            results.innerHTML = `
                <strong>Estimated additional completions:</strong> <span class="number">${additional}</span><br/>
                <strong>Program value unlocked:</strong> <span class="number">$${gain.toLocaleString()}</span>
            `;
        });
        
        grid.appendChild(benefits);
        grid.appendChild(roi);
        return grid;
    }
};