// Learn Component
const Learn = {
    render() {
        const grid = Utils.el('div', { className: 'grid' });
        
        const card = Utils.section('Privacy-First Rules');
        
        const rulesList = Utils.el('ul');
        rulesList.innerHTML = `
            <li><strong>Do not collect immigration status.</strong> If you don't collect it, you can't disclose it.</li>
            <li><strong>Data minimization:</strong> collect only fields required by statute/contract.</li>
            <li><strong>Two-dataset model:</strong> local PII file; grant dataset = anonymous IDs + metrics.</li>
            <li><strong>Short retention:</strong> publish and enforce a deletion schedule.</li>
            <li><strong>Role-based access:</strong> limit who can view PII; keep access logs.</li>
            <li><strong>Beneficiary notice:</strong> multilingual "we don't ask status" script + handouts.</li>
        `;
        card.appendChild(rulesList);

        const buttonRow = Utils.el('div', {
            style: 'display:flex;gap:0.5rem;margin-top:1rem;flex-wrap:wrap'
        });
        
        const noticeBtn = Utils.el('button', {
            className: 'btn btn-ghost',
            textContent: 'Insert sample beneficiary notice'
        });
        noticeBtn.onclick = () => this.insertNotice();
        
        const clausesBtn = Utils.el('button', {
            className: 'btn btn-ghost',
            textContent: 'Insert sample contract clauses'
        });
        clausesBtn.onclick = () => this.insertClauses();
        
        buttonRow.appendChild(noticeBtn);
        buttonRow.appendChild(clausesBtn);
        card.appendChild(buttonRow);

        const textarea = Utils.el('textarea', {
            id: 'learn_notes',
            placeholder: 'Your notes / adaptations...',
            value: Storage.data.learn.notes || '',
            style: 'margin-top:1rem'
        });
        textarea.addEventListener('input', e => {
            Storage.data.learn.notes = e.target.value;
        });
        card.appendChild(textarea);

        grid.appendChild(card);
        return grid;
    },

    insertNotice() {
        const textarea = document.getElementById('learn_notes');
        if (textarea) {
            Storage.data.learn.notes += Utils.getBeneficiaryNotice();
            textarea.value = Storage.data.learn.notes;
            Utils.toast('Inserted sample beneficiary notice');
        }
    },

    insertClauses() {
        const textarea = document.getElementById('learn_notes');
        if (textarea) {
            Storage.data.learn.notes += Utils.getContractClauses();
            textarea.value = Storage.data.learn.notes;
            Utils.toast('Inserted sample contract clauses');
        }
    }
};
