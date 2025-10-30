// Stakeholders Component
const Stakeholders = {
    render() {
        const grid = Utils.el('div', { className: 'grid' });
        
        const card = Utils.section('Stakeholder Map');
        const table = Utils.el('table');
        table.innerHTML = `
            <thead>
                <tr>
                    <th>Role</th>
                    <th>Wins</th>
                    <th>Worries</th>
                    <th>What to Show Them</th>
                </tr>
            </thead>
            <tbody>
                ${Storage.data.personas.map(p => `
                    <tr>
                        <td><strong>${p.role}</strong></td>
                        <td>${p.wins.join(', ')}</td>
                        <td>${p.worries.join(', ')}</td>
                        <td>
                            ${Utils.badge('1-pager').outerHTML}
                            ${Utils.badge('Checklist').outerHTML}
                            ${Utils.badge('Sample report').outerHTML}
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        `;
        card.appendChild(table);
        
        const talking = Utils.section('Talking Points');
        const talkingList = Utils.el('ul');
        talkingList.innerHTML = `
            <li><strong>We never ask about status.</strong> That's policy, not preference.</li>
            <li>We collect only what's needed for services and reporting—no names in exports.</li>
            <li>Audits are easier with documented minimization and retention.</li>
            <li>This increases uptake among priority communities.</li>
        `;
        talking.appendChild(talkingList);
        
        grid.appendChild(card);
        grid.appendChild(talking);
        return grid;
    }
};