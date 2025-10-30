// Evidence Library Component
const Evidence = {
    render() {
        const grid = Utils.el('div', { className: 'grid' });
        
        const card = Utils.section('Evidence Library');
        const intro = Utils.el('p', { className: 'muted' });
        intro.textContent = 'Collect research, templates, and documentation to support your privacy-first approach.';
        card.appendChild(intro);
        
        const list = Utils.el('div', { id: 'evidenceList' });
        this.renderEvidence(list);
        
        const addBtn = Utils.el('button', {
            className: 'btn btn-primary',
            textContent: '+ Add Source',
            style: 'margin-top:1rem'
        });
        addBtn.addEventListener('click', () => {
            Storage.data.evidence.push({ title: '', note: '', url: '' });
            this.renderEvidence(list);
        });
        
        card.appendChild(list);
        card.appendChild(addBtn);
        grid.appendChild(card);
        return grid;
    },
    
    renderEvidence(container) {
        container.innerHTML = '';
        
        if (Storage.data.evidence.length === 0) {
            const empty = Utils.el('p', { className: 'muted', style: 'text-align:center;padding:2rem' });
            empty.textContent = 'No sources yet. Add your first evidence source above.';
            container.appendChild(empty);
            return;
        }
        
        Storage.data.evidence.forEach((item, index) => {
            const row = Utils.el('div', { 
                className: 'field-row',
                style: 'margin-bottom:1rem;align-items:flex-start;flex-wrap:wrap'
            });
            
            const titleInput = Utils.el('input', {
                type: 'text',
                placeholder: 'Title',
                value: item.title,
                style: 'min-width:200px'
            });
            titleInput.addEventListener('input', e => {
                Storage.data.evidence[index].title = e.target.value;
            });
            
            const noteInput = Utils.el('input', {
                type: 'text',
                placeholder: 'Note / why it matters',
                value: item.note,
                style: 'flex:2;min-width:250px'
            });
            noteInput.addEventListener('input', e => {
                Storage.data.evidence[index].note = e.target.value;
            });
            
            const urlInput = Utils.el('input', {
                type: 'text',
                placeholder: 'URL (optional)',
                value: item.url,
                style: 'min-width:200px'
            });
            urlInput.addEventListener('input', e => {
                Storage.data.evidence[index].url = e.target.value;
            });
            
            const removeBtn = Utils.el('button', {
                className: 'btn btn-danger',
                textContent: 'Remove'
            });
            removeBtn.addEventListener('click', () => {
                Storage.data.evidence.splice(index, 1);
                this.renderEvidence(container);
            });
            
            row.appendChild(titleInput);
            row.appendChild(noteInput);
            row.appendChild(urlInput);
            row.appendChild(removeBtn);
            container.appendChild(row);
        });
    }
};