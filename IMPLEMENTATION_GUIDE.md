# Implementation Guide for Remaining Components

This guide provides detailed specifications for implementing the remaining toolkit components.

## Component Implementation Order (Recommended)

1. **Business Case** (Easy - mostly static content)
2. **Stakeholders** (Easy - table rendering)
3. **Comms** (Easy - static content)
4. **Evidence** (Medium - CRUD operations)
5. **Audit** (Medium - checklist with state)
6. **Inventory** (Medium - complex table with calculations)
7. **Flow** (Medium - dynamic list + ID generation)
8. **Reporting** (Medium-Hard - field selection + JSON export)
9. **Training** (Hard - quiz system)
10. **Matrix** (Hard - calculations + recommendations)

---

## 1. Business Case Component

**File**: `js/components/business.js`

### Data Structure
Uses existing Storage.data structure, may add:
```javascript
business: {
    households: 300,
    dropoffReduction: 12,
    avgValue: 3500
}
```

### UI Elements
- Static benefits list
- ROI calculator form (3 inputs + calculate button)
- Results display area

### Implementation
```javascript
const Business = {
    render() {
        const grid = Utils.el('div', { className: 'grid' });
        
        // Benefits card
        const benefits = Utils.section('Why This Model Wins');
        benefits.innerHTML = `<ul>
            <li><strong>Equity & trust:</strong> Fewer sensitive questions → higher participation</li>
            <li><strong>Compliance by design:</strong> Exports meet reporting without PII exposure</li>
            <li><strong>Operational speed:</strong> Standard fields = faster intake</li>
            <li><strong>Lower audit risk:</strong> Short retention + RBAC reduce breach exposure</li>
            <li><strong>Program outcomes:</strong> More completions, less attrition</li>
        </ul>`;
        
        // ROI calculator
        const roi = Utils.section('Back-of-the-Envelope ROI');
        roi.innerHTML = `
            <div class="field-row">
                <label>Households/year
                    <input type="number" id="hhs" value="300"/>
                </label>
                <label>Drop-off reduction (%)
                    <input type="number" id="drop" value="12"/>
                </label>
                <label>Avg value per completion ($)
                    <input type="number" id="val" value="3500"/>
                </label>
                <button class="btn btn-primary" id="calcBtn">Calculate</button>
            </div>
            <div id="roiResults" class="alert alert-info" style="display:none;margin-top:1rem"></div>
        `;
        
        roi.querySelector('#calcBtn').addEventListener('click', () => {
            const hh = parseInt(document.getElementById('hhs').value) || 0;
            const drop = parseInt(document.getElementById('drop').value) || 0;
            const val = parseInt(document.getElementById('val').value) || 0;
            const additional = Math.round(hh * (drop / 100));
            const gain = additional * val;
            
            const results = document.getElementById('roiResults');
            results.style.display = 'block';
            results.innerHTML = `
                <strong>Estimated additional completions:</strong> ${additional}<br/>
                <strong>Program value unlocked:</strong> $${gain.toLocaleString()}
            `;
        });
        
        grid.appendChild(benefits);
        grid.appendChild(roi);
        return grid;
    }
};
```

---

## 2. Stakeholders Component

**File**: `js/components/stakeholders.js`

### Data Structure
Uses `Storage.data.personas` (already defined)

### Implementation
```javascript
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
        talking.innerHTML = `<ul>
            <li><strong>We never ask about status.</strong> That's policy, not preference.</li>
            <li>We collect only what's needed—no names in exports.</li>
            <li>Audits are easier with documented minimization.</li>
            <li>This increases uptake among priority communities.</li>
        </ul>`;
        
        grid.appendChild(card);
        grid.appendChild(talking);
        return grid;
    }
};
```

---

## 3. Communications Kit Component

**File**: `js/components/comms.js`

### Implementation
```javascript
const Comms = {
    render() {
        const grid = Utils.el('div', { className: 'grid' });
        
        const pitch = Utils.section('Elevator Pitch & FAQ');
        pitch.innerHTML = `
            <h3>Elevator Pitch</h3>
            <p>We protect households while meeting funder needs. We keep personal info local, 
            report anonymous metrics upstream, and delete sensitive data quickly. That means 
            more participation, less risk, and faster projects.</p>
            
            <h3>FAQ</h3>
            <ul>
                <li><strong>Do you collect immigration status?</strong> No. It's against policy.</li>
                <li><strong>How do you report results?</strong> Anonymous IDs plus metrics (ZIP, savings, measures).</li>
                <li><strong>What if auditors ask for PII?</strong> We maintain local records with RBAC and provide 
                de-identified evidence. PII requests go through counsel.</li>
                <li><strong>Will this slow us down?</strong> It speeds intake by removing unnecessary fields.</li>
            </ul>
        `;
        
        const scripts = Utils.section('Scripts & Notices');
        scripts.innerHTML = `
            <p class="muted">Use these scripts at intake and outreach. 
            Customize in <strong>Learn → Insert sample…</strong></p>
            <div style="display:flex;gap:0.5rem;margin-top:1rem">
                <button class="btn btn-ghost" id="jumpLearn">Go to Learn section</button>
            </div>
        `;
        
        scripts.querySelector('#jumpLearn').addEventListener('click', () => {
            App.currentTab = 'learn';
            App.renderTabs();
            App.render();
        });
        
        grid.appendChild(pitch);
        grid.appendChild(scripts);
        return grid;
    }
};
```

---

## 4. Evidence Library Component

**File**: `js/components/evidence.js`

### Implementation
```javascript
const Evidence = {
    render() {
        const grid = Utils.el('div', { className: 'grid' });
        
        const card = Utils.section('Evidence Library');
        
        const list = Utils.el('div');
        Storage.data.evidence.forEach((item, index) => {
            const row = Utils.el('div', { className: 'field-row', style: 'margin-bottom:1rem' });
            row.innerHTML = `
                <input type="text" placeholder="Title" value="${item.title}" data-index="${index}" data-field="title"/>
                <input type="text" placeholder="Note/why it matters" value="${item.note}" data-index="${index}" data-field="note"/>
                <input type="text" placeholder="URL (optional)" value="${item.url}" data-index="${index}" data-field="url"/>
                <button class="btn btn-danger" data-index="${index}">Remove</button>
            `;
            
            row.querySelectorAll('input').forEach(input => {
                input.addEventListener('input', e => {
                    const idx = parseInt(e.target.dataset.index);
                    const field = e.target.dataset.field;
                    Storage.data.evidence[idx][field] = e.target.value;
                });
            });
            
            row.querySelector('button').addEventListener('click', e => {
                const idx = parseInt(e.target.dataset.index);
                Storage.data.evidence.splice(idx, 1);
                App.render();
            });
            
            list.appendChild(row);
        });
        
        const addBtn = Utils.el('button', {
            className: 'btn btn-primary',
            textContent: '+ Add Source'
        });
        addBtn.addEventListener('click', () => {
            Storage.data.evidence.push({ title: '', note: '', url: '' });
            App.render();
        });
        
        card.appendChild(list);
        card.appendChild(addBtn);
        grid.appendChild(card);
        return grid;
    }
};
```

---

## 5. Audit Prep Component

**File**: `js/components/audit.js`

### Implementation
```javascript
const Audit = {
    render() {
        const grid = Utils.el('div', { className: 'grid' });
        
        const checklist = Utils.section('Audit Prep Checklist');
        
        const list = Utils.el('div');
        Storage.data.check.items.forEach((item, index) => {
            const label = Utils.el('label', { style: 'display:block;margin:0.5rem 0' });
            const checkbox = Utils.el('input', { type: 'checkbox', checked: item.done });
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
        
        const notes = Utils.section('Notes');
        const textarea = Utils.el('textarea', {
            placeholder: 'Decisions, exceptions, approvals…',
            value: Storage.data.check.notes || ''
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
        const percent = (done / total) * 100;
        const fill = document.getElementById('auditFill');
        if (fill) fill.style.width = percent + '%';
    }
};
```

---

## Register Components in app.js

After implementing each component, update `js/app.js`:

```javascript
tabs: [
    { id: 'overview', label: 'Overview', component: Overview },
    { id: 'learn', label: 'Learn', component: Learn },
    { id: 'business', label: 'Business Case', component: Business },  // Add this
    { id: 'stake', label: 'Stakeholders', component: Stakeholders },  // Add this
    // ... etc
]
```

---

## Testing Checklist

For each component:
- [ ] Renders without errors
- [ ] Updates Storage.data correctly
- [ ] Save button persists changes to localStorage
- [ ] Responsive on mobile/tablet
- [ ] Follows design system (colors, spacing, typography)
- [ ] Event listeners don't leak (clean on re-render)

---

## Advanced Components

For **Inventory**, **Flow**, **Reporting**, **Training**, and **Matrix** components, refer to the original HTML inline implementation as a reference. The pattern remains the same:

1. Create component object with `render()` method
2. Build UI using `Utils` helpers
3. Attach event listeners
4. Update `Storage.data`
5. Return the grid element

Need help with a specific component? Let me know!
