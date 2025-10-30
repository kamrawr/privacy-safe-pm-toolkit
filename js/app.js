// Main application controller
const App = {
    currentTab: 'overview',
    
    tabs: [
        { id: 'overview', label: 'Overview', component: Overview },
        { id: 'learn', label: 'Learn', component: Learn },
        { id: 'business', label: 'Business Case', component: null },
        { id: 'stake', label: 'Stakeholders', component: null },
        { id: 'training', label: 'Training', component: null },
        { id: 'comms', label: 'Comms Kit', component: null },
        { id: 'inventory', label: 'Field Inventory', component: null },
        { id: 'flow', label: 'Data Flow', component: null },
        { id: 'report', label: 'Reporting', component: null },
        { id: 'matrix', label: 'Game-Theory', component: null },
        { id: 'evidence', label: 'Evidence', component: null },
        { id: 'check', label: 'Audit Prep', component: null }
    ],

    init() {
        this.renderTabs();
        this.render();
        this.attachSaveHandler();
    },

    renderTabs() {
        const tabsContainer = document.getElementById('tabs');
        tabsContainer.innerHTML = '';
        
        this.tabs.forEach(tab => {
            const button = Utils.el('button', {
                className: 'tab' + (this.currentTab === tab.id ? ' active' : ''),
                textContent: tab.label
            });
            button.addEventListener('click', () => {
                this.currentTab = tab.id;
                this.renderTabs();
                this.render();
            });
            tabsContainer.appendChild(button);
        });
    },

    render() {
        const app = document.getElementById('app');
        app.innerHTML = '';

        const currentTabData = this.tabs.find(t => t.id === this.currentTab);
        
        if (currentTabData && currentTabData.component) {
            const content = currentTabData.component.render();
            app.appendChild(content);
        } else {
            // Placeholder for unimplemented tabs
            const placeholder = Utils.el('div', { className: 'card' });
            placeholder.innerHTML = `
                <h2>${currentTabData.label}</h2>
                <div class="alert alert-info">
                    <p>This section is under development. Refer to the README for implementation guidelines.</p>
                </div>
            `;
            app.appendChild(placeholder);
        }
    },

    attachSaveHandler() {
        const saveBtn = document.getElementById('saveAll');
        saveBtn.addEventListener('click', () => {
            Storage.save();
            Utils.toast('Data saved successfully');
        });
    }
};

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => App.init());
} else {
    App.init();
}
