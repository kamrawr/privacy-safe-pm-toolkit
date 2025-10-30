// Training Component
const Training = {
    render() {
        const grid = Utils.el('div', { className: 'grid' });
        
        // Learning tracks
        const tracks = Utils.section('Learning Tracks');
        const trackList = Utils.el('div', { style: 'margin-bottom:1.5rem' });
        Storage.data.training.tracks.forEach(track => {
            const trackDiv = Utils.el('div', { style: 'margin-bottom:1rem' });
            trackDiv.innerHTML = `
                ${Utils.badge(track.title, 'badge-primary').outerHTML}
                <span class="muted" style="margin-left:0.5rem">— Modules: ${track.includes.join(', ')}</span>
            `;
            trackList.appendChild(trackDiv);
        });
        tracks.appendChild(trackList);
        
        // Modules
        const modulesSection = Utils.section('Training Modules & Quizzes');
        Storage.data.training.modules.forEach(module => {
            const moduleCard = Utils.el('div', { 
                className: 'card',
                style: 'margin-bottom:1rem'
            });
            
            const header = Utils.el('h3');
            header.textContent = module.title;
            moduleCard.appendChild(header);
            
            const goals = Utils.el('p', { className: 'muted' });
            goals.innerHTML = '<strong>Goals:</strong> ' + module.goals.join(' • ');
            moduleCard.appendChild(goals);
            
            const startBtn = Utils.el('button', {
                className: 'btn btn-primary',
                textContent: 'Start Quiz'
            });
            startBtn.onclick = () => this.startQuiz(module.id, moduleCard);
            moduleCard.appendChild(startBtn);
            
            const quizContainer = Utils.el('div', { 
                id: `quiz_${module.id}`,
                style: 'margin-top:1rem'
            });
            moduleCard.appendChild(quizContainer);
            
            modulesSection.appendChild(moduleCard);
        });
        
        grid.appendChild(tracks);
        grid.appendChild(modulesSection);
        return grid;
    },
    
    startQuiz(moduleId, container) {
        const module = Storage.data.training.modules.find(m => m.id === moduleId);
        if (!module) return;
        
        const quizHost = container.querySelector(`#quiz_${moduleId}`);
        quizHost.innerHTML = '';
        
        module.quiz.forEach((question, qi) => {
            const qCard = Utils.el('div', { 
                className: 'card',
                style: 'margin-bottom:1rem;background:var(--bg-subtle)'
            });
            
            const qTitle = Utils.el('div', { className: 'k', style: 'margin-bottom:0.5rem' });
            qTitle.textContent = `Q${qi + 1}. ${question.q}`;
            qCard.appendChild(qTitle);
            
            question.a.forEach((answer, ai) => {
                const label = Utils.el('label', { 
                    style: 'display:block;margin:0.5rem 0'
                });
                const radio = Utils.el('input', {
                    type: 'radio',
                    name: `q_${moduleId}_${qi}`,
                    value: ai
                });
                label.appendChild(radio);
                label.append(' ' + answer);
                qCard.appendChild(label);
            });
            
            quizHost.appendChild(qCard);
        });
        
        const submitBtn = Utils.el('button', {
            className: 'btn btn-success',
            textContent: 'Submit Quiz'
        });
        submitBtn.onclick = () => this.gradeQuiz(moduleId, module);
        quizHost.appendChild(submitBtn);
    },
    
    gradeQuiz(moduleId, module) {
        let correct = 0;
        module.quiz.forEach((question, qi) => {
            const selected = document.querySelector(`input[name="q_${moduleId}_${qi}"]:checked`);
            if (selected && parseInt(selected.value) === question.correct) {
                correct++;
            }
        });
        
        const percent = Math.round((correct / module.quiz.length) * 100);
        const passed = percent >= 70;
        
        Utils.toast(`Score: ${correct}/${module.quiz.length} (${percent}%) - ${passed ? 'Passed!' : 'Review and try again'}`);
    }
};