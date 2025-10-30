// Communications Kit Component
const Comms = {
    render() {
        const grid = Utils.el('div', { className: 'grid' });
        
        const pitch = Utils.section('Elevator Pitch & FAQ');
        
        const pitchTitle = Utils.el('h3');
        pitchTitle.textContent = 'Elevator Pitch';
        pitch.appendChild(pitchTitle);
        
        const pitchText = Utils.el('p');
        pitchText.textContent = 'We protect households while meeting funder needs. We keep personal info local, report anonymous metrics upstream, and delete sensitive data quickly. That means more participation, less risk, and faster projects.';
        pitch.appendChild(pitchText);
        
        const faqTitle = Utils.el('h3', { style: 'margin-top:1.5rem' });
        faqTitle.textContent = 'FAQ';
        pitch.appendChild(faqTitle);
        
        const faqList = Utils.el('ul');
        faqList.innerHTML = `
            <li><strong>Do you collect immigration status?</strong> No. It's not required and against policy.</li>
            <li><strong>How do you report results?</strong> With anonymous IDs plus metrics (ZIP, savings, measures).</li>
            <li><strong>What if auditors ask for PII?</strong> We maintain local records with role-based access and provide de-identified evidence. Any PII requests go through counsel.</li>
            <li><strong>Will this slow us down?</strong> It speeds intake by removing unnecessary fields.</li>
        `;
        pitch.appendChild(faqList);
        
        const scripts = Utils.section('Scripts & Notices');
        const scriptsText = Utils.el('p', { className: 'muted' });
        scriptsText.innerHTML = 'Use these scripts at intake and outreach. Customize in <strong>Learn → Insert sample…</strong>';
        scripts.appendChild(scriptsText);
        
        const btnRow = Utils.el('div', { style: 'display:flex;gap:0.5rem;margin-top:1rem' });
        const jumpBtn = Utils.el('button', {
            className: 'btn btn-ghost',
            textContent: 'Go to Learn section'
        });
        jumpBtn.addEventListener('click', () => {
            App.currentTab = 'learn';
            App.renderTabs();
            App.render();
        });
        btnRow.appendChild(jumpBtn);
        scripts.appendChild(btnRow);
        
        grid.appendChild(pitch);
        grid.appendChild(scripts);
        return grid;
    }
};