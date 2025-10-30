// Audit Prep Component
const Audit = {
    render() {
        const grid = Utils.el('div', { className: 'grid' });
        
        const checklist = Utils.section('Audit Prep Checklist');
        
        const list = Utils.el('div', { style: 'margin-bottom:1.5rem' });
        Storage.data.check.items.forEach((item, index) => {
            const label = Utils.el('label', { 
                style: 'display:block;margin:0.75rem 0;font-size:0.95rem'
            });
            const checkbox = Utils.el('input', { 
                type: 'checkbox', 
                checked: item.done
            });
            checkbox.addEventListener('change', e => {
                Storage.data.check.items[index].done = e.target.checked;
                this.updateProgress();
            });
            label.appendChild(checkbox);
            label.append(' ' + item.t);
            list.appendChild(label);
        });
        
        checklist.appendChild(list);
        
        // Progress bar
        const progressDiv = Utils.el('div', { className: 'progress', id: 'auditProgress' });
        const progressFill = Utils.el('div', { className: 'progress-fill', id: 'auditFill' });
        progressDiv.appendChild(progressFill);
        checklist.appendChild(progressDiv);
        
        const progressText = Utils.el('p', {
            id: 'progressText',
            className: 'muted',
            style: 'margin-top:0.5rem;text-align:center'
        });
        checklist.appendChild(progressText);
        
        // Notes
        const notes = Utils.section('Audit Notes');
        const notesIntro = Utils.el('p', { className: 'muted' });
        notesIntro.textContent = 'Document decisions, exceptions, and approval dates for audit trail.';
        notes.appendChild(notesIntro);
        
        const textarea = Utils.el('textarea', {
            placeholder: 'Decisions, exceptions, approvals…',
            value: Storage.data.check.notes || '',
            style: 'min-height:150px'
        });
        textarea.addEventListener('input', e => {
            Storage.data.check.notes = e.target.value;
        });
        notes.appendChild(textarea);
        
        grid.appendChild(checklist);
        grid.appendChild(notes);
        
        // Set initial progress
        setTimeout(() => this.updateProgress(), 0);
        
        return grid;
    },
    
    updateProgress() {
        const done = Storage.data.check.items.filter(i => i.done).length;
        const total = Storage.data.check.items.length;
        const percent = Math.round((done / total) * 100);
        
        const fill = document.getElementById('auditFill');
        const text = document.getElementById('progressText');
        
        if (fill) fill.style.width = percent + '%';
        if (text) {
            text.textContent = `${done} of ${total} items complete (${percent}%)`;
            if (percent === 100) {
                text.innerHTML += ' <strong style="color:var(--success)">✓ Audit ready!</strong>';
            }
        }
    }
};