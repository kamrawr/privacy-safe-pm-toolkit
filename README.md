# Privacy-Safe Program Management Toolkit

**🌐 [Launch Live App](https://kamrawr.github.io/privacy-safe-pm-toolkit/)** | [GitHub Repo](https://github.com/kamrawr/privacy-safe-pm-toolkit)

A client-side web application for designing privacy-protective energy assistance programs that serve multilingual and low-income communities.

## 🎯 Purpose

This toolkit helps program managers, community-based organizations, and funders design data collection and reporting workflows that:

- **Protect vulnerable households** from immigration enforcement and data misuse
- **Meet funder requirements** with de-identified, aggregated metrics
- **Build community trust** through transparent "no-status" policies
- **Reduce audit risk** via data minimization and short retention schedules

## 🚀 Quick Start

### GitHub Pages Deployment

1. Push this repository to GitHub
2. Go to **Settings > Pages**
3. Set source to **Deploy from branch: main** (or your default branch)
4. Set folder to **/ (root)**
5. Click **Save**
6. Visit `https://[your-username].github.io/privacy-safe-pm-toolkit/`

### Local Development

Simply open `index.html` in a web browser. No build process required.

```bash
open index.html
# or
python3 -m http.server 8000  # then visit http://localhost:8000
```

## 📁 Project Structure

```
privacy-safe-pm-toolkit/
├── index.html                 # Main HTML file
├── styles/
│   ├── main.css              # Core styles (light theme)
│   └── components.css        # Component-specific styles
├── js/
│   ├── storage.js            # localStorage management
│   ├── utils.js              # Utility functions
│   ├── app.js                # Main application controller
│   └── components/           # UI components (modular)
│       ├── overview.js       # ✅ Implemented
│       ├── learn.js          # ✅ Implemented
│       ├── business.js       # 🚧 To be implemented
│       ├── stakeholders.js   # 🚧 To be implemented
│       ├── training.js       # 🚧 To be implemented
│       ├── comms.js          # 🚧 To be implemented
│       ├── inventory.js      # 🚧 To be implemented
│       ├── flow.js           # 🚧 To be implemented
│       ├── reporting.js      # 🚧 To be implemented
│       ├── matrix.js         # 🚧 To be implemented
│       ├── evidence.js       # 🚧 To be implemented
│       └── audit.js          # 🚧 To be implemented
└── README.md
```

## 🛠️ Implementing Components

Each component follows this pattern:

```javascript
// js/components/example.js
const ExampleComponent = {
    render() {
        const grid = Utils.el('div', { className: 'grid' });
        
        // Create your UI
        const card = Utils.section('Section Title');
        card.innerHTML = '<p>Content here</p>';
        
        // Add event listeners
        const input = card.querySelector('#some-input');
        input.addEventListener('input', e => {
            Storage.data.someField = e.target.value;
        });
        
        grid.appendChild(card);
        return grid;
    }
};
```

Then register it in `js/app.js`:

```javascript
{ id: 'example', label: 'Example Tab', component: ExampleComponent }
```

### Component Implementation Guide

#### Business Case Component
- ROI calculator (households/year × drop-off reduction × avg value)
- Business case talking points
- Equity and trust benefits

#### Stakeholders Component
- Stakeholder matrix table (Role, Wins, Worries, What to show)
- Talking points by persona

#### Training Component
- Display training modules with goals and quizzes
- Track completion
- Learning tracks (Frontline, PM, Partner Leads)

#### Comms Component
- Elevator pitch text
- FAQ section
- Sample scripts and notices

#### Inventory Component
- Field inventory table with toggles
- Risk scoring (0-5)
- Banned field warnings
- Aggregate risk calculation

#### Flow Component
- Data flow diagram/description
- Partner settings management
- Household ID generator

#### Reporting Component
- De-identified field selector
- JSON report generator
- Download functionality

#### Matrix Component
- Game-theory strategy comparison table
- Weight adjustment sliders
- Score calculator
- Best strategy recommender

#### Evidence Component
- Evidence library list
- Add/edit/remove sources

#### Audit Component
- Checklist with progress bar
- Notes field

## 🎨 Design System

### Colors

```css
--primary: #0969da      /* Primary actions */
--success: #1a7f37      /* Low risk, positive states */
--warning: #9a6700      /* Caution, medium risk */
--danger: #cf222e       /* High risk, banned fields */
--text: #24292e         /* Body text */
--text-muted: #586069   /* Secondary text */
```

### Components

- **Cards**: `Utils.section('Title', optionalRightContent)`
- **Pills**: `Utils.pill('Text', 'pill-success|warning|danger')`
- **Badges**: `Utils.badge('Text', 'badge-primary|success|warning|danger')`
- **Toast**: `Utils.toast('Message')`
- **Grid**: Use `.grid` with `.span6`, `.span4`, `.span8`, etc.

## 🔒 Privacy & Security

- **100% client-side**: No data leaves the browser
- **localStorage only**: All data stored locally
- **No tracking**: No analytics, cookies, or third-party scripts
- **No dependencies**: Pure vanilla JavaScript

## 📋 Key Concepts

### No-Status Rule
Never collect immigration or citizenship status. If you don't collect it, you can't disclose it.

### Two-Dataset Model
1. **Local PII Dataset**: Names, contacts, addresses (CBO only, RBAC-protected)
2. **Grant Dataset**: Anonymous HouseholdIDs + metrics (for upstream reporting)

### Data Minimization
Collect only fields required by statute/contract. Challenge every field.

### Short Retention
Publish and enforce a PII deletion schedule (typically 12-24 months).

## 👥 Target Audiences

- **CBO Executives**: Risk mitigation, community trust
- **Program Managers**: Operational workflows, compliance
- **Contractors**: Simplified intake processes
- **State/Funder Staff**: De-identified metrics, audit readiness
- **Community Members**: Privacy protection, transparency

## 📄 License

This toolkit is designed for public benefit. Built by [Isaiah Kamrar](https://github.com/kamrawr) for multilingual and low-income communities.

## 🤝 Contributing

This is a simple, dependency-free project. To contribute:

1. Fork the repository
2. Implement missing components following the pattern in `overview.js` and `learn.js`
3. Test locally by opening `index.html`
4. Submit a pull request

## 📞 Support

For questions about privacy-protective program design, data governance, or energy assistance implementation, contact Community Consulting Partners LLC.

---

**Built for communities. Protects privacy. Meets requirements.**
