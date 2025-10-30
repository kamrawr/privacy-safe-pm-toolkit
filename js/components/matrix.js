// Game-Theory Matrix Component
const Matrix = {
    render() {
        const grid = Utils.el('div', { className: 'grid' });
        
        const card = Utils.section('Strategy Comparison Matrix');
        
        const table = Utils.el('table', { id: 'matrixTable' });
        table.innerHTML = `
            <thead>
                <tr>
                    <th>Strategy</th>
                    <th>Benefit</th>
                    <th>PII Risk</th>
                    <th>Compliance</th>
                    <th>Uptake</th>
                    <th>Score</th>
                </tr>
            </thead>
        `;
        
        const tbody = Utils.el('tbody');
        this.renderStrategies(tbody);
        table.appendChild(tbody);
        card.appendChild(table);
        
        // Weights
        const weights = Utils.section('Adjust Weights');
        const weightsDiv = Utils.el('div', { 
            style: 'display:flex;gap:1rem;flex-wrap:wrap;align-items:flex-end'
        });
        
        const W = Storage.data.matrix.weights;
        
        ['benefit', 'piiRisk', 'compliance', 'uptake'].forEach(key => {
            const group = Utils.el('div', { className: 'field-group' });
            const label = Utils.el('label', { 
                textContent: key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')
            });
            const input = Utils.el('input', {
                type: 'number',
                step: '0.1',
                value: W[key],
                style: 'width:100px',
                'data-weight': key
            });
            input.addEventListener('input', e => {
                Storage.data.matrix.weights[key] = parseFloat(e.target.value) || 0;
                this.updateScores();
            });
            group.appendChild(label);
            group.appendChild(input);
            weightsDiv.appendChild(group);
        });
        
        const suggestBtn = Utils.el('button', {
            className: 'btn btn-primary',
            textContent: 'Suggest Best Strategy',
            style: 'margin-left:auto'
        });
        suggestBtn.addEventListener('click', () => this.suggestStrategy());
        weightsDiv.appendChild(suggestBtn);
        
        weights.appendChild(weightsDiv);
        
        grid.appendChild(card);
        grid.appendChild(weights);
        
        return grid;
    },
    
    renderStrategies(tbody) {
        tbody.innerHTML = '';
        const W = Storage.data.matrix.weights;
        
        Storage.data.matrix.strategies.forEach((strategy, index) => {
            const tr = Utils.el('tr');
            
            const tdName = Utils.el('td');
            tdName.innerHTML = `<strong>${strategy.name}</strong>`;
            tr.appendChild(tdName);
            
            ['benefit', 'piiRisk', 'compliance', 'uptake'].forEach(key => {
                const td = Utils.el('td');
                const input = Utils.el('input', {
                    type: 'number',
                    min: 0,
                    max: 5,
                    value: strategy[key],
                    style: 'width:80px',
                    'data-strategy': index,
                    'data-field': key
                });
                input.addEventListener('input', e => {
                    const val = parseInt(e.target.value) || 0;
                    Storage.data.matrix.strategies[index][key] = Math.min(5, Math.max(0, val));
                    this.updateScores();
                });
                td.appendChild(input);
                tr.appendChild(td);
            });
            
            const tdScore = Utils.el('td');
            const score = Utils.calculateStrategyScore(strategy, W);
            const scoreClass = score >= 6 ? 'pill-success' : score >= 2 ? 'pill-warning' : 'pill-danger';
            tdScore.appendChild(Utils.pill(score.toFixed(1), scoreClass));
            tdScore.classList.add('score-cell');
            tr.appendChild(tdScore);
            
            tbody.appendChild(tr);
        });
    },
    
    updateScores() {
        const tbody = document.querySelector('#matrixTable tbody');
        if (tbody) {
            this.renderStrategies(tbody);
        }
    },
    
    suggestStrategy() {
        const W = Storage.data.matrix.weights;
        let best = null;
        let bestScore = -Infinity;
        
        Storage.data.matrix.strategies.forEach(strategy => {
            const score = Utils.calculateStrategyScore(strategy, W);
            if (score > bestScore) {
                bestScore = score;
                best = strategy;
            }
        });
        
        if (best) {
            alert(`Recommended Strategy: ${best.name}\n\nScore: ${bestScore.toFixed(2)}\n\nThis strategy offers the best balance based on your current weights.`);
        }
    }
};