// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Check if localStorage is available
    if (typeof(Storage) === "undefined") {
        alert("LocalStorage is not supported in your browser. Some features may not work.");
        return;
    }

    // Initialize data structures if they don't exist
    initializeStorage();

    // Set up event listeners
    setupEventListeners();

    // Show welcome screen by default
    showScreen('welcome');

    // If admin is already logged in, show dashboard
    if (localStorage.getItem('currentAdmin')) {
        showScreen('dashboard');
        updateDashboard();
    }
});

// Initialize localStorage with default data structures
function initializeStorage() {
    if (!localStorage.getItem('admins')) {
        localStorage.setItem('admins', JSON.stringify([]));
    }
    
    if (!localStorage.getItem('certificates')) {
        localStorage.setItem('certificates', JSON.stringify([]));
    }
    
    if (!localStorage.getItem('defaults')) {
        localStorage.setItem('defaults', JSON.stringify({
            providerName: '',
            providerDesignation: '',
            logo: '',
            signature: ''
        }));
    }
}

// Set up all event listeners
function setupEventListeners() {
    // Navigation
    document.querySelectorAll('.nav-dock li').forEach(item => {
        item.addEventListener('click', function() {
            const target = this.getAttribute('data-target');
            showScreen(target);
        });
    });

    // Welcome screen
    document.getElementById('getStarted').addEventListener('click', function() {
        showScreen('entry');
    });

    // Entry panel tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            switchTab(tabId);
        });
    });

    // Login form
    document.getElementById('loginForm').addEventListener('submit', function(e) {
        e.preventDefault();
        handleLogin();
    });

    // Register form
    document.getElementById('registerForm').addEventListener('submit', function(e) {
        e.preventDefault();
        handleRegistration();
    });

    // Verify form
    document.getElementById('verifyForm').addEventListener('submit', function(e) {
        e.preventDefault();
        verifyCertificate();
    });

    // Dashboard buttons
    document.getElementById('newCertBtn').addEventListener('click', function() {
        showScreen('generator');
        resetGenerator();
    });

    document.getElementById('bulkUploadBtn').addEventListener('click', function() {
        alert("Bulk upload feature will be implemented in a future version.");
    });

    document.getElementById('manageVerifyBtn').addEventListener('click', function() {
        showScreen('manager');
    });

    document.getElementById('viewAllBtn').addEventListener('click', function() {
        showScreen('manager');
    });

    // Certificate generator steps
    document.querySelectorAll('.step').forEach(step => {
        step.addEventListener('click', function() {
            const stepNum = parseInt(this.getAttribute('data-step'));
            goToStep(stepNum);
        });
    });

    // Step 1: Candidate details - real-time updates
    document.getElementById('fullName').addEventListener('input', updatePreview);
    document.getElementById('internshipTitle').addEventListener('input', updatePreview);
    document.getElementById('orgName').addEventListener('input', updatePreview);
    document.getElementById('providerName').addEventListener('input', updatePreview);
    document.getElementById('providerDesignation').addEventListener('input', updatePreview);

    document.querySelector('#step1 .next-btn').addEventListener('click', function() {
        if (validateStep1()) {
            goToStep(2);
            updatePreview();
        }
    });

    // Step 2: Certificate type
    document.querySelectorAll('.type-card').forEach(card => {
        card.addEventListener('click', function() {
            selectCertificateType(this);
        });
    });

    document.getElementById('certContent').addEventListener('input', function() {
        certificateData.content.en = this.value;
        updatePreview();
    });

    document.querySelector('#step2 .next-btn').addEventListener('click', function() {
        if (validateStep2()) {
            goToStep(3);
            updatePreview();
        }
    });

    document.querySelector('#step2 .prev-btn').addEventListener('click', function() {
        goToStep(1);
    });

    // Step 3: Template selection
    document.querySelectorAll('.template-card').forEach(card => {
        card.addEventListener('click', function() {
            selectTemplate(this);
        });
    });

    document.getElementById('customTemplate').addEventListener('change', function(e) {
        handleCustomTemplateUpload(e);
    });

    document.querySelector('#step3 .next-btn').addEventListener('click', function() {
        if (validateStep3()) {
            goToStep(4);
            updatePreview();
        }
    });

    document.querySelector('#step3 .prev-btn').addEventListener('click', function() {
        goToStep(2);
    });

    // Step 4: Design customization - real-time updates
    document.getElementById('headerFont').addEventListener('change', updatePreview);
    document.getElementById('nameFont').addEventListener('change', updatePreview);
    document.getElementById('bodyFont').addEventListener('change', updatePreview);
    document.getElementById('headerSize').addEventListener('input', updatePreview);
    document.getElementById('nameSize').addEventListener('input', updatePreview);
    document.getElementById('bodySize').addEventListener('input', updatePreview);
    document.getElementById('textColor').addEventListener('input', updatePreview);
    document.getElementById('nameColor').addEventListener('input', updatePreview);
    document.getElementById('showBorder').addEventListener('change', updatePreview);
    document.getElementById('shadowIntensity').addEventListener('input', updatePreview);
    document.getElementById('textAlignment').addEventListener('change', updatePreview);
    document.getElementById('logoUpload').addEventListener('change', handleLogoUpload);
    document.getElementById('signatureUpload').addEventListener('change', handleSignatureUpload);

    document.querySelector('#step4 .next-btn').addEventListener('click', function() {
        goToStep(5);
        generateQRCode();
        updatePreview();
    });

    document.querySelector('#step4 .prev-btn').addEventListener('click', function() {
        goToStep(3);
    });

    // Step 5: Final export
    document.getElementById('exportPdf').addEventListener('click', exportAsPdf);
    document.getElementById('exportJpg').addEventListener('click', exportAsJpg);
    document.getElementById('printCert').addEventListener('click', printCertificate);
    document.getElementById('saveCert').addEventListener('click', saveCertificate);

    document.querySelector('#step5 .prev-btn').addEventListener('click', function() {
        goToStep(4);
    });

    // Certificate manager
    document.getElementById('certSearch').addEventListener('input', filterCertificates);
    document.getElementById('typeFilter').addEventListener('change', filterCertificates);
    document.getElementById('statusFilter').addEventListener('change', filterCertificates);
    document.getElementById('prevPage').addEventListener('click', prevPage);
    document.getElementById('nextPage').addEventListener('click', nextPage);

    // Admin settings
    document.querySelectorAll('.settings-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab') + 'Tab';
            switchSettingsTab(tabId);
        });
    });

    document.getElementById('adminForm').addEventListener('submit', function(e) {
        e.preventDefault();
        updateAdminDetails();
    });

    document.getElementById('exportData').addEventListener('click', exportAllData);
    document.getElementById('importData').addEventListener('click', triggerImport);
    document.getElementById('dataFile').addEventListener('change', importData);
    document.getElementById('softReset').addEventListener('click', softReset);
    document.getElementById('hardReset').addEventListener('click', hardReset);

    document.getElementById('defaultsForm').addEventListener('submit', function(e) {
        e.preventDefault();
        saveDefaults();
    });

    document.getElementById('defaultLogo').addEventListener('change', function(e) {
        previewImage(e, 'defaultLogoPreview');
    });

    document.getElementById('defaultSignature').addEventListener('change', function(e) {
        previewImage(e, 'defaultSignaturePreview');
    });

    // Initialize defaults
    loadDefaults();
}

// Screen management
function showScreen(screenId) {
    // Hide all screens
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    
    // Show the requested screen
    document.getElementById(screenId).classList.add('active');
    
    // Special cases
    if (screenId === 'dashboard') {
        updateDashboard();
    } else if (screenId === 'manager') {
        loadCertificates();
    } else if (screenId === 'settings') {
        loadAdminDetails();
    }
}

// Entry panel tab switching
function switchTab(tabId) {
    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`.tab-btn[data-tab="${tabId}"]`).classList.add('active');
    
    // Update tab content
    document.querySelectorAll('.tab-pane').forEach(pane => {
        pane.classList.remove('active');
    });
    document.getElementById(tabId).classList.add('active');
}

// Admin login
function handleLogin() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    const admins = JSON.parse(localStorage.getItem('admins'));
    const admin = admins.find(a => a.email === email);
    
    if (!admin) {
        alert('Admin not found. Please register.');
        return;
    }
    
    // In a real app, we would hash the password and compare hashes
    if (admin.password === password) {
        localStorage.setItem('currentAdmin', JSON.stringify(admin));
        showScreen('dashboard');
        updateDashboard();
    } else {
        alert('Incorrect password. Please try again.');
    }
}

// Admin registration
function handleRegistration() {
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    if (password !== confirmPassword) {
        alert('Passwords do not match.');
        return;
    }
    
    const admins = JSON.parse(localStorage.getItem('admins'));
    
    // Check if admin already exists
    if (admins.some(a => a.email === email)) {
        alert('Admin with this email already exists.');
        return;
    }
    
    // In a real app, we would hash the password before storing
    admins.push({ email, password });
    localStorage.setItem('admins', JSON.stringify(admins));
    
    alert('Registration successful. Please login.');
    switchTab('login');
    document.getElementById('loginEmail').value = email;
    document.getElementById('loginPassword').value = '';
    document.getElementById('registerEmail').value = '';
    document.getElementById('registerPassword').value = '';
    document.getElementById('confirmPassword').value = '';
}

// Certificate verification
function verifyCertificate() {
    const certId = document.getElementById('certId').value.trim();
    const certificates = JSON.parse(localStorage.getItem('certificates'));
    const cert = certificates.find(c => c.id === certId);
    
    const resultDiv = document.getElementById('verifyResult');
    const statusDiv = document.getElementById('verifyStatus');
    const previewDiv = document.getElementById('certPreview');
    
    resultDiv.classList.remove('hidden');
    previewDiv.classList.add('hidden');
    
    if (!cert) {
        statusDiv.innerHTML = `
            <h3>❌ Not Verified</h3>
            <p>Certificate with ID ${certId} not found in our records.</p>
        `;
        statusDiv.className = 'status-card not-verified';
        return;
    }
    
    let statusText, statusClass;
    switch (cert.status) {
        case 'verified':
            statusText = '✅ Verified';
            statusClass = 'verified';
            break;
        case 'waiting':
            statusText = '⏳ Waiting';
            statusClass = 'waiting';
            break;
        default:
            statusText = '❌ Not Verified';
            statusClass = 'not-verified';
    }
    
    statusDiv.innerHTML = `
        <h3>${statusText}</h3>
        <p>Certificate ID: ${cert.id}</p>
        <p>Issued to: ${cert.name}</p>
        <p>Type: ${cert.type}</p>
        <p>Issued on: ${new Date(cert.issueDate).toLocaleDateString()}</p>
    `;
    statusDiv.className = `status-card ${statusClass}`;
    
    // Show preview for verified certificates
    if (cert.status === 'verified') {
        previewDiv.classList.remove('hidden');
        previewDiv.innerHTML = `
            <h4>Certificate Preview</h4>
            <div class="certificate-preview" style="
                background: white;
                padding: 1rem;
                border-radius: 8px;
                margin-top: 1rem;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            ">
                <h3 style="font-family: 'Cormorant Garamond', serif; text-align: center; margin-bottom: 1rem;">
                    Certificate of ${cert.type}
                </h3>
                <p style="text-align: center; margin-bottom: 1rem;">This certifies that</p>
                <h2 style="font-family: 'Cormorant Garamond', serif; text-align: center; margin: 1rem 0; color: #1a365d;">
                    ${cert.name}
                </h2>
                <p style="text-align: center; margin-bottom: 1rem;">${cert.content.en}</p>
                <div style="display: flex; justify-content: space-between; margin-top: 2rem;">
                    <div style="width: 80px; height: 80px; background: #f5f5f5;"></div>
                    <div style="text-align: right;">
                        <div style="height: 60px; width: 150px; margin-bottom: 0.5rem; background: #f5f5f5;"></div>
                        <p style="font-weight: bold;">${cert.provider.name}</p>
                        <p>${cert.provider.designation}</p>
                    </div>
                </div>
            </div>
        `;
    }
}

// Dashboard functions
function updateDashboard() {
    const currentAdmin = JSON.parse(localStorage.getItem('currentAdmin'));
    if (!currentAdmin) return;
    
    document.getElementById('welcomeAdmin').textContent = `Welcome, ${currentAdmin.email}`;
    
    const certificates = JSON.parse(localStorage.getItem('certificates'));
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    // Total certificates
    document.getElementById('totalCerts').textContent = certificates.length;
    
    // This week's certificates
    const weeklyCerts = certificates.filter(c => {
        const certDate = new Date(c.issueDate);
        return certDate >= oneWeekAgo;
    }).length;
    document.getElementById('weeklyCerts').textContent = weeklyCerts;
    
    // Top certificate type
    const typeCounts = {};
    certificates.forEach(c => {
        typeCounts[c.type] = (typeCounts[c.type] || 0) + 1;
    });
    
    let topType = 'None';
    let maxCount = 0;
    for (const type in typeCounts) {
        if (typeCounts[type] > maxCount) {
            maxCount = typeCounts[type];
            topType = type;
        }
    }
    document.getElementById('topType').textContent = topType;
    
    // Update chart (simplified)
    updateChart(typeCounts);
}

function updateChart(typeCounts) {
    const ctx = document.getElementById('certChart').getContext('2d');
    
    // Destroy previous chart if it exists
    if (window.certChart) {
        window.certChart.destroy();
    }
    
    const labels = Object.keys(typeCounts);
    const data = Object.values(typeCounts);
    const backgroundColors = labels.map((_, i) => {
        const ratio = i / labels.length;
        return `rgb(${Math.floor(160 + ratio * 95)}, ${Math.floor(233 - ratio * 183)}, ${Math.floor(224 - ratio * 53)})`;
    });
    
    window.certChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: backgroundColors,
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right',
                }
            }
        }
    });
}

// Certificate generator functions
let currentStep = 1;
let certificateData = {
    id: '',
    name: '',
    email: '',
    type: '',
    template: '',
    status: 'verified',
    org: '',
    provider: {
        name: '',
        designation: ''
    },
    content: {
        en: ''
    },
    style: {
        font: 'Cormorant Garamond',
        color: '#333333',
        logo: '',
        signature: ''
    }
};

function resetGenerator() {
    currentStep = 1;
    certificateData = {
        id: generateCertId(),
        name: '',
        email: '',
        type: '',
        template: '',
        status: 'verified',
        org: '',
        provider: {
            name: '',
            designation: ''
        },
        content: {
            en: ''
        },
        style: {
            font: 'Cormorant Garamond',
            color: '#333333',
            logo: '',
            signature: ''
        }
    };
    
    // Reset UI
    document.querySelectorAll('.step').forEach((step, index) => {
        if (index === 0) {
            step.classList.add('active');
        } else {
            step.classList.remove('active');
        }
    });
    
    document.querySelectorAll('.step-content').forEach((content, index) => {
        if (index === 0) {
            content.classList.add('active');
        } else {
            content.classList.remove('active');
        }
    });
    
    // Reset form fields
    document.getElementById('fullName').value = '';
    document.getElementById('candidateEmail').value = '';
    document.getElementById('internshipTitle').value = '';
    document.getElementById('orgName').value = '';
    document.getElementById('providerName').value = '';
    document.getElementById('providerDesignation').value = '';
    document.getElementById('certIdDisplay').value = certificateData.id;
    
    // Reset preview
    updatePreview();
}

function generateCertId() {
    const now = new Date();
    const year = now.getFullYear();
    const certs = JSON.parse(localStorage.getItem('certificates'));
    const certNum = certs.length + 1;
    return `CERT-${year}-${certNum.toString().padStart(4, '0')}`;
}

function goToStep(stepNum) {
    if (stepNum < 1 || stepNum > 5) return;
    
    currentStep = stepNum;
    
    // Update step indicators
    document.querySelectorAll('.step').forEach((step, index) => {
        if (index < stepNum) {
            step.classList.add('active');
        } else {
            step.classList.remove('active');
        }
    });
    
    // Update step content
    document.querySelectorAll('.step-content').forEach((content, index) => {
        if (index === stepNum - 1) {
            content.classList.add('active');
        } else {
            content.classList.remove('active');
        }
    });
}

function validateStep1() {
    const name = document.getElementById('fullName').value.trim();
    const title = document.getElementById('internshipTitle').value.trim();
    const org = document.getElementById('orgName').value.trim();
    const providerName = document.getElementById('providerName').value.trim();
    const providerDesignation = document.getElementById('providerDesignation').value.trim();
    
    if (!name) {
        alert('Please enter the recipient name.');
        return false;
    }
    
    if (!title) {
        alert('Please enter the course/program title.');
        return false;
    }
    
    if (!org) {
        alert('Please enter the organization/platform name.');
        return false;
    }
    
    if (!providerName) {
        alert('Please enter the provider name.');
        return false;
    }
    
    if (!providerDesignation) {
        alert('Please enter the provider designation.');
        return false;
    }
    
    // Save data
    certificateData.name = name;
    certificateData.email = document.getElementById('candidateEmail').value.trim();
    certificateData.internshipTitle = title;
    certificateData.org = org;
    certificateData.provider.name = providerName;
    certificateData.provider.designation = providerDesignation;
    certificateData.issueDate = new Date().toISOString().split('T')[0];
    
    return true;
}

function validateStep2() {
    if (!certificateData.type) {
        alert('Please select a certificate type.');
        return false;
    }
    
    if (!certificateData.content.en) {
        alert('Please enter certificate content.');
        return false;
    }
    
    return true;
}

function validateStep3() {
    if (!certificateData.template) {
        alert('Please select a template.');
        return false;
    }
    
    return true;
}

function selectCertificateType(card) {
    document.querySelectorAll('.type-card').forEach(c => {
        c.classList.remove('selected');
    });
    
    card.classList.add('selected');
    const type = card.getAttribute('data-type');
    certificateData.type = type;
    
    // Show content editor for custom type
    const contentEditor = document.querySelector('.cert-content-editor');
    if (type === 'custom') {
        contentEditor.classList.remove('hidden');
        document.getElementById('certContent').value = certificateData.content.en || '';
    } else {
        contentEditor.classList.add('hidden');
        certificateData.content.en = generateCertificateContent(type);
        document.getElementById('certContent').value = certificateData.content.en;
    }
    
    updatePreview();
}

function generateCertificateContent(type) {
    const name = certificateData.name || '[Name]';
    const topic = certificateData.internshipTitle || '[Topic]';
    const platform = certificateData.org || '[Platform]';
    
    switch (type) {
        case 'technical':
            return `This is to certify that ${name} has successfully completed the course "${topic}" offered by ${platform}, demonstrating hands-on technical proficiency and applied development skills.`;
        case 'research':
            return `This certifies that ${name} has completed the research course "${topic}" via ${platform}, engaging in critical inquiry and demonstrating academic discipline.`;
        case 'ngo':
            return `This certifies that ${name} has successfully completed the awareness training "${topic}" on ${platform}, preparing them for social responsibility and community outreach.`;
        case 'campus':
            return `${name} has completed the ambassador program "${topic}" provided by ${platform}, showcasing leadership and promotional engagement within academic networks.`;
        case 'freelance':
            return `${name} has completed the freelance-oriented course "${topic}" on ${platform}, demonstrating readiness for independent project delivery and client interaction.`;
        case 'course':
            return `This certifies that ${name} has completed the course "${topic}" via ${platform}, demonstrating both conceptual understanding and practical command of the subject.`;
        case 'bootcamp':
            return `${name} has completed the immersive bootcamp course "${topic}" on ${platform}, gaining real-world exposure and building production-ready skills.`;
        case 'skill':
            return `This certifies that ${name} has passed the skill certification in "${topic}" through ${platform}, showcasing verified proficiency and domain knowledge.`;
        case 'internship':
            return `This certifies that ${name} has completed the internship of "${topic}" from ${platform}, contributing consistently and learning applied industry skills.`;
        case 'appreciation':
            return `In appreciation of ${name} completing the engagement "${topic}" via ${platform}, this certificate acknowledges dedication and quality contributions.`;
        default:
            return `This is to certify that ${name} has successfully completed the requirements and demonstrated proficiency in the subject matter.`;
    }
}

function selectTemplate(card) {
    document.querySelectorAll('.template-card').forEach(c => {
        c.classList.remove('selected');
    });
    
    card.classList.add('selected');
    certificateData.template = card.getAttribute('data-template');
    
    // Handle custom template upload
    if (certificateData.template === 'custom') {
        document.getElementById('customTemplate').click();
    }
    
    updatePreview();
}

function handleCustomTemplateUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(event) {
        const templateCard = document.querySelector('.template-card[data-template="custom"] .template-preview');
        templateCard.style.backgroundImage = `url(${event.target.result})`;
        certificateData.customTemplate = event.target.result;
        updatePreview();
    };
    reader.readAsDataURL(file);
}

function handleLogoUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(event) {
        certificateData.style.logo = event.target.result;
        updatePreview();
    };
    reader.readAsDataURL(file);
}

function handleSignatureUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(event) {
        certificateData.style.signature = event.target.result;
        updatePreview();
    };
    reader.readAsDataURL(file);
}

function updatePreview() {
    const preview = document.getElementById('certificatePreview');
    
    // Apply template class
    preview.className = 'certificate';
    if (certificateData.template) {
        preview.classList.add(certificateData.template);
    }
    
    // Update header
    const logoDiv = preview.querySelector('.certificate-logo');
    if (certificateData.style.logo) {
        logoDiv.style.backgroundImage = `url(${certificateData.style.logo})`;
    } else {
        logoDiv.style.backgroundImage = '';
    }
    
    // Update organization name
    const orgDiv = preview.querySelector('.certificate-org');
    orgDiv.textContent = certificateData.org || '[Organization]';
    
    // Update title
    const title = preview.querySelector('.certificate-title');
    title.textContent = `Certificate of ${certificateData.type || 'Completion'}`;
    title.style.fontFamily = document.getElementById('headerFont').value || 'Cormorant Garamond';
    title.style.fontSize = `${document.getElementById('headerSize').value}px`;
    title.style.color = document.getElementById('textColor').value || '#333333';
    
    // Update recipient name
    const name = preview.querySelector('.recipient-name');
    name.textContent = certificateData.name || 'Recipient Name';
    name.style.fontFamily = document.getElementById('nameFont').value || 'Cormorant Garamond';
    name.style.fontSize = `${document.getElementById('nameSize').value}px`;
    name.style.color = document.getElementById('nameColor').value || '#1a365d';
    
    // Update certificate content
    const content = preview.querySelector('.certificate-content');
    content.textContent = certificateData.content.en || 'has successfully completed the requirements and demonstrated proficiency in the subject matter.';
    content.style.fontFamily = document.getElementById('bodyFont').value || 'Inter';
    content.style.fontSize = `${document.getElementById('bodySize').value}px`;
    content.style.color = document.getElementById('textColor').value || '#333333';
    content.style.textAlign = document.getElementById('textAlignment').value || 'center';
    
    // Update provider info
    const providerName = preview.querySelector('.provider-name');
    providerName.textContent = certificateData.provider.name || 'Provider Name';
    
    const providerDesignation = preview.querySelector('.provider-designation');
    providerDesignation.textContent = certificateData.provider.designation || 'Provider Designation';
    
    // Update signature
    const signatureDiv = preview.querySelector('.signature-image');
    if (certificateData.style.signature) {
        signatureDiv.style.backgroundImage = `url(${certificateData.style.signature})`;
    } else {
        signatureDiv.style.backgroundImage = '';
    }
    
    // Update certificate ID
    const certId = preview.querySelector('.certificate-id');
    certId.textContent = certificateData.id || 'CERT-YYYY-0000';
    
    // Update border and shadow
    if (document.getElementById('showBorder').checked) {
        preview.style.border = '1px solid #e0e0e0';
    } else {
        preview.style.border = 'none';
    }
    
    const shadowIntensity = document.getElementById('shadowIntensity').value;
    preview.style.boxShadow = `0 ${shadowIntensity}px ${shadowIntensity * 2}px rgba(0, 0, 0, 0.1)`;
    
    // Update range value displays
    document.getElementById('headerSizeValue').textContent = document.getElementById('headerSize').value;
    document.getElementById('nameSizeValue').textContent = document.getElementById('nameSize').value;
    document.getElementById('bodySizeValue').textContent = document.getElementById('bodySize').value;
    document.getElementById('shadowValue').textContent = document.getElementById('shadowIntensity').value;
}

function generateQRCode() {
    const qrDiv = document.querySelector('.certificate-qr');
    qrDiv.innerHTML = '';
    
    if (certificateData.id) {
        new QRCode(qrDiv, {
            text: `Certificate ID: ${certificateData.id}\nRecipient: ${certificateData.name}\nStatus: ${certificateData.status}`,
            width: 80,
            height: 80,
            colorDark: "#000000",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.H
        });
    }
}

// Export functions
function exportAsPdf() {
    const { jsPDF } = window.jspdf;
    const element = document.getElementById('certificatePreview');
    
    // Temporarily hide navigation for clean export
    const nav = document.querySelector('.nav-dock');
    const navDisplay = nav.style.display;
    nav.style.display = 'none';
    
    html2canvas(element, {
        scale: 2,
        logging: false,
        useCORS: true,
        allowTaint: true
    }).then(canvas => {
        const imgData = canvas.toDataURL('image/png', 1.0);
        const pdf = new jsPDF('l', 'mm', 'a4');
        const width = pdf.internal.pageSize.getWidth();
        const height = pdf.internal.pageSize.getHeight();
        
        pdf.addImage(imgData, 'PNG', 0, 0, width, height);
        pdf.save(`Certificate_${certificateData.id}.pdf`);
        
        // Restore navigation
        nav.style.display = navDisplay;
    });
}

function exportAsJpg() {
    const element = document.getElementById('certificatePreview');
    
    // Temporarily hide navigation for clean export
    const nav = document.querySelector('.nav-dock');
    const navDisplay = nav.style.display;
    nav.style.display = 'none';
    
    html2canvas(element, {
        scale: 2,
        logging: false,
        useCORS: true,
        allowTaint: true
    }).then(canvas => {
        const link = document.createElement('a');
        link.download = `Certificate_${certificateData.id}.jpg`;
        link.href = canvas.toDataURL('image/jpeg', 1.0);
        link.click();
        
        // Restore navigation
        nav.style.display = navDisplay;
    });
}

function printCertificate() {
    const element = document.getElementById('certificatePreview');
    const printWindow = window.open('', '', 'width=800,height=600');
    
    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Print Certificate</title>
            <style>
                @page { size: landscape; margin: 0; }
                body { margin: 0; }
                img { width: 100%; height: 100%; object-fit: contain; }
            </style>
        </head>
        <body>
    `);
    
    html2canvas(element, {
        scale: 2,
        logging: false,
        useCORS: true,
        allowTaint: true
    }).then(canvas => {
        printWindow.document.write(`<img src="${canvas.toDataURL('image/png')}" />`);
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        
        setTimeout(() => {
            printWindow.focus();
            printWindow.print();
            printWindow.close();
        }, 500);
    });
}

function saveCertificate() {
    if (!certificateData.name || !certificateData.type || !certificateData.template) {
        alert('Please complete all required fields before saving.');
        return;
    }
    
    const certificates = JSON.parse(localStorage.getItem('certificates'));
    certificates.push(certificateData);
    localStorage.setItem('certificates', JSON.stringify(certificates));
    
    alert('Certificate saved successfully!');
    showScreen('manager');
    loadCertificates();
}

// Certificate manager functions
let currentPage = 1;
const certsPerPage = 10;

function loadCertificates() {
    const certificates = JSON.parse(localStorage.getItem('certificates'));
    const tableBody = document.querySelector('#certificateTable tbody');
    tableBody.innerHTML = '';
    
    // Apply filters
    const typeFilter = document.getElementById('typeFilter').value;
    const statusFilter = document.getElementById('statusFilter').value;
    const searchTerm = document.getElementById('certSearch').value.toLowerCase();
    
    let filteredCerts = certificates.filter(cert => {
        const matchesType = typeFilter === 'all' || cert.type.toLowerCase().includes(typeFilter);
        const matchesStatus = statusFilter === 'all' || cert.status === statusFilter;
        const matchesSearch = searchTerm === '' || 
            cert.name.toLowerCase().includes(searchTerm) || 
            cert.email.toLowerCase().includes(searchTerm) || 
            cert.id.toLowerCase().includes(searchTerm);
        
        return matchesType && matchesStatus && matchesSearch;
    });
    
    // Pagination
    const totalPages = Math.ceil(filteredCerts.length / certsPerPage);
    document.getElementById('pageInfo').textContent = `Page ${currentPage} of ${totalPages}`;
    
    document.getElementById('prevPage').disabled = currentPage === 1;
    document.getElementById('nextPage').disabled = currentPage === totalPages || totalPages === 0;
    
    const startIdx = (currentPage - 1) * certsPerPage;
    const endIdx = startIdx + certsPerPage;
    const pageCerts = filteredCerts.slice(startIdx, endIdx);
    
    // Populate table
    if (pageCerts.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = `<td colspan="8" style="text-align: center;">No certificates found</td>`;
        tableBody.appendChild(row);
    } else {
        pageCerts.forEach(cert => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${cert.name}</td>
                <td>${cert.email}</td>
                <td>${cert.type}</td>
                <td>${cert.id}</td>
                <td>${new Date(cert.issueDate).toLocaleDateString()}</td>
                <td>${cert.template}</td>
                <td>
                    <span class="status-badge ${cert.status}">
                        ${cert.status === 'verified' ? '✅ Verified' : 
                          cert.status === 'waiting' ? '⏳ Waiting' : '❌ Not Verified'}
                    </span>
                </td>
                <td class="actions">
                    <span class="action-icon edit" data-id="${cert.id}">✏️</span>
                    <span class="action-icon preview" data-id="${cert.id}">👁️</span>
                    <span class="action-icon delete" data-id="${cert.id}">🗑️</span>
                    <span class="action-icon download" data-id="${cert.id}">📥</span>
                </td>
            `;
            tableBody.appendChild(row);
        });
    }
    
    // Add event listeners to action icons
    document.querySelectorAll('.edit').forEach(icon => {
        icon.addEventListener('click', function() {
            editCertificate(this.getAttribute('data-id'));
        });
    });
    
    document.querySelectorAll('.preview').forEach(icon => {
        icon.addEventListener('click', function() {
            previewCertificate(this.getAttribute('data-id'));
        });
    });
    
    document.querySelectorAll('.delete').forEach(icon => {
        icon.addEventListener('click', function() {
            deleteCertificate(this.getAttribute('data-id'));
        });
    });
    
    document.querySelectorAll('.download').forEach(icon => {
        icon.addEventListener('click', function() {
            downloadCertificate(this.getAttribute('data-id'));
        });
    });
}

function filterCertificates() {
    currentPage = 1;
    loadCertificates();
}

function prevPage() {
    if (currentPage > 1) {
        currentPage--;
        loadCertificates();
    }
}

function nextPage() {
    const certificates = JSON.parse(localStorage.getItem('certificates'));
    const totalPages = Math.ceil(certificates.length / certsPerPage);
    
    if (currentPage < totalPages) {
        currentPage++;
        loadCertificates();
    }
}

function editCertificate(certId) {
    const certificates = JSON.parse(localStorage.getItem('certificates'));
    const certIndex = certificates.findIndex(c => c.id === certId);
    
    if (certIndex !== -1) {
        certificateData = certificates[certIndex];
        
        // Populate form fields
        document.getElementById('fullName').value = certificateData.name;
        document.getElementById('candidateEmail').value = certificateData.email;
        document.getElementById('internshipTitle').value = certificateData.internshipTitle || '';
        document.getElementById('orgName').value = certificateData.org;
        document.getElementById('providerName').value = certificateData.provider.name;
        document.getElementById('providerDesignation').value = certificateData.provider.designation;
        document.getElementById('certIdDisplay').value = certificateData.id;
        
        // Select certificate type
        const typeCard = document.querySelector(`.type-card[data-type="${certificateData.type}"]`);
        if (typeCard) {
            selectCertificateType(typeCard);
        }
        
        // Select template
        const templateCard = document.querySelector(`.template-card[data-template="${certificateData.template}"]`);
        if (templateCard) {
            selectTemplate(templateCard);
        }
        
        // Go to generator screen
        showScreen('generator');
        goToStep(1);
        updatePreview();
    }
}

function previewCertificate(certId) {
    const certificates = JSON.parse(localStorage.getItem('certificates'));
    const cert = certificates.find(c => c.id === certId);
    
    if (cert) {
        // Create a preview modal
        const modal = document.createElement('div');
        modal.style.position = 'fixed';
        modal.style.top = '0';
        modal.style.left = '0';
        modal.style.width = '100%';
        modal.style.height = '100%';
        modal.style.backgroundColor = 'rgba(0,0,0,0.8)';
        modal.style.display = 'flex';
        modal.style.justifyContent = 'center';
        modal.style.alignItems = 'center';
        modal.style.zIndex = '1000';
        
        // Create certificate preview
        const certPreview = document.createElement('div');
        certPreview.style.width = '80%';
        certPreview.style.maxWidth = '800px';
        certPreview.style.backgroundColor = 'white';
        certPreview.style.padding = '2rem';
        certPreview.style.borderRadius = '8px';
        certPreview.style.position = 'relative';
        
        // Close button
        const closeBtn = document.createElement('button');
        closeBtn.textContent = '×';
        closeBtn.style.position = 'absolute';
        closeBtn.style.top = '10px';
        closeBtn.style.right = '10px';
        closeBtn.style.background = 'none';
        closeBtn.style.border = 'none';
        closeBtn.style.fontSize = '1.5rem';
        closeBtn.style.cursor = 'pointer';
        closeBtn.addEventListener('click', () => document.body.removeChild(modal));
        
        // Certificate content
        certPreview.innerHTML = `
            <div style="text-align: center; margin-bottom: 2rem;">
                <h2 style="font-family: 'Cormorant Garamond', serif;">Certificate of ${cert.type}</h2>
            </div>
            <div style="text-align: center; margin-bottom: 1rem;">
                <p>This certifies that</p>
                <h3 style="font-family: 'Cormorant Garamond', serif; font-size: 2rem; color: #1a365d;">
                    ${cert.name}
                </h3>
                <p>${cert.content.en}</p>
            </div>
            <div style="display: flex; justify-content: space-between; margin-top: 3rem;">
                <div style="width: 100px; height: 100px; background: #f5f5f5;"></div>
                <div style="text-align: right;">
                    <div style="height: 80px; width: 200px; margin-bottom: 0.5rem; background: #f5f5f5;"></div>
                    <p style="font-weight: bold;">${cert.provider.name}</p>
                    <p>${cert.provider.designation}</p>
                </div>
            </div>
        `;
        
        certPreview.prepend(closeBtn);
        modal.appendChild(certPreview);
        document.body.appendChild(modal);
        
        // Add QR code if it exists
        if (cert.id) {
            const qrDiv = certPreview.querySelector('div:first-child');
            new QRCode(qrDiv, {
                text: `Certificate ID: ${cert.id}\nRecipient: ${cert.name}\nStatus: ${cert.status}`,
                width: 100,
                height: 100,
                colorDark: "#000000",
                colorLight: "#ffffff",
                correctLevel: QRCode.CorrectLevel.H
            });
        }
    }
}

function deleteCertificate(certId) {
    if (confirm('Are you sure you want to delete this certificate? This action cannot be undone.')) {
        const certificates = JSON.parse(localStorage.getItem('certificates'));
        const updatedCerts = certificates.filter(c => c.id !== certId);
        localStorage.setItem('certificates', JSON.stringify(updatedCerts));
        loadCertificates();
    }
}

function downloadCertificate(certId) {
    const certificates = JSON.parse(localStorage.getItem('certificates'));
    const cert = certificates.find(c => c.id === certId);
    
    if (cert) {
        certificateData = cert;
        exportAsPdf();
    }
}

// Admin settings functions
function switchSettingsTab(tabId) {
    document.querySelectorAll('.settings-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    document.querySelector(`.settings-tab[data-tab="${tabId.replace('Tab', '')}"]`).classList.add('active');
    
    document.querySelectorAll('.settings-pane').forEach(pane => {
        pane.classList.remove('active');
    });
    
    document.getElementById(tabId).classList.add('active');
}

function loadAdminDetails() {
    const currentAdmin = JSON.parse(localStorage.getItem('currentAdmin'));
    if (currentAdmin) {
        document.getElementById('currentEmail').value = currentAdmin.email;
    }
}

function updateAdminDetails() {
    const currentAdmin = JSON.parse(localStorage.getItem('currentAdmin'));
    if (!currentAdmin) return;
    
    const newEmail = document.getElementById('newEmail').value.trim();
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmNewPassword = document.getElementById('confirmNewPassword').value;
    
    // Validate current password
    const admins = JSON.parse(localStorage.getItem('admins'));
    const adminIndex = admins.findIndex(a => a.email === currentAdmin.email);
    
    if (admins[adminIndex].password !== currentPassword) {
        alert('Current password is incorrect.');
        return;
    }
    
    // Validate new password if changed
    if (newPassword && newPassword !== confirmNewPassword) {
        alert('New passwords do not match.');
        return;
    }
    
    // Update admin details
    if (newEmail) {
        // Check if email is already taken
        if (admins.some(a => a.email === newEmail && a.email !== currentAdmin.email)) {
            alert('This email is already registered.');
            return;
        }
        
        currentAdmin.email = newEmail;
        admins[adminIndex].email = newEmail;
    }
    
    if (newPassword) {
        admins[adminIndex].password = newPassword;
    }
    
    localStorage.setItem('currentAdmin', JSON.stringify(currentAdmin));
    localStorage.setItem('admins', JSON.stringify(admins));
    
    alert('Admin details updated successfully.');
    document.getElementById('newEmail').value = '';
    document.getElementById('currentPassword').value = '';
    document.getElementById('newPassword').value = '';
    document.getElementById('confirmNewPassword').value = '';
}

function exportAllData() {
    const data = {
        admins: JSON.parse(localStorage.getItem('admins')),
        certificates: JSON.parse(localStorage.getItem('certificates')),
        defaults: JSON.parse(localStorage.getItem('defaults'))
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'certificate_generator_data.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function triggerImport() {
    document.getElementById('dataFile').click();
}

function importData(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    if (!confirm('Importing data will overwrite your current certificates and admin accounts. Continue?')) {
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(event) {
        try {
            const data = JSON.parse(event.target.result);
            
            if (data.admins) localStorage.setItem('admins', JSON.stringify(data.admins));
            if (data.certificates) localStorage.setItem('certificates', JSON.stringify(data.certificates));
            if (data.defaults) localStorage.setItem('defaults', JSON.stringify(data.defaults));
            
            alert('Data imported successfully!');
            if (localStorage.getItem('currentAdmin')) {
                showScreen('dashboard');
                updateDashboard();
            } else {
                showScreen('entry');
            }
        } catch (error) {
            alert('Error importing data: ' + error.message);
        }
    };
    reader.readAsText(file);
}

function softReset() {
    if (confirm('This will delete all certificates but keep admin accounts. Continue?')) {
        localStorage.setItem('certificates', JSON.stringify([]));
        alert('All certificates have been deleted.');
        if (localStorage.getItem('currentAdmin')) {
            showScreen('dashboard');
            updateDashboard();
        }
    }
}

function hardReset() {
    if (confirm('This will delete ALL data including admin accounts. Continue?')) {
        localStorage.clear();
        initializeStorage();
        alert('All data has been reset.');
        showScreen('welcome');
    }
}

function loadDefaults() {
    const defaults = JSON.parse(localStorage.getItem('defaults'));
    if (!defaults) return;
    
    document.getElementById('defaultProviderName').value = defaults.providerName || '';
    document.getElementById('defaultProviderDesignation').value = defaults.providerDesignation || '';
    
    if (defaults.logo) {
        document.getElementById('defaultLogoPreview').style.backgroundImage = `url(${defaults.logo})`;
    }
    
    if (defaults.signature) {
        document.getElementById('defaultSignaturePreview').style.backgroundImage = `url(${defaults.signature})`;
    }
}

function saveDefaults() {
    const defaults = {
        providerName: document.getElementById('defaultProviderName').value.trim(),
        providerDesignation: document.getElementById('defaultProviderDesignation').value.trim(),
        logo: document.getElementById('defaultLogoPreview').style.backgroundImage || '',
        signature: document.getElementById('defaultSignaturePreview').style.backgroundImage || ''
    };
    
    localStorage.setItem('defaults', JSON.stringify(defaults));
    alert('Default settings saved successfully!');
}

function previewImage(e, previewId) {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(event) {
        document.getElementById(previewId).style.backgroundImage = `url(${event.target.result})`;
    };
    reader.readAsDataURL(file);
}