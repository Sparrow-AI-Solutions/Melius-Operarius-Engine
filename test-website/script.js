// Melius Engine Dashboard script
// Handles special tags and initialization logic

document.addEventListener('DOMContentLoaded', function() {
    console.log('Melius Engine Dashboard loaded successfully');

    // Render special tags
    renderSpecialTags();
});

function renderSpecialTags() {
    // Process {{form}} tags
    document.querySelectorAll('template[data-type="form"]').forEach(el => {
        const formId = el.dataset.formId || 'default';
        // Bucket will be dynamically assigned when Pantry form is registered
        // Validate against forms_registry before rendering (to be updated later)
        console.warn('Form bucket not assigned for form_id:', formId, '— call request_new_form_bucket() if missing');
    });

    // Process {{countdown}} tags
    document.querySelectorAll('[data-component="countdown"]').forEach(el => {
        const targetDateStr = el.dataset.targetDate;
        if (!targetDateStr) return;

        const targetDate = new Date(targetDateStr).getTime();
        if (isNaN(targetDate)) {
            el.innerHTML = 'Invalid date';
            return;
        }

        const update = () => {
            const now = new Date().getTime();
            const distance = targetDate - now;
            if (distance < 0) {
                el.innerHTML = 'Expired';
                clearInterval(Number(el.dataset.timerId));
                return;
            }
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);
            el.innerHTML = `${days}d ${hours}h ${minutes}m ${seconds}s`;
        };
        update();
        const timerId = setInterval(update, 1000);
        el.dataset.timerId = timerId;
    });

    // Process {{live_time}} tags
    document.querySelectorAll('[data-component="live_time"]').forEach(el => {
        const update = () => {
            const now = new Date();
            el.innerHTML = now.toLocaleString();
        };
        update();
        setInterval(update, 1000);
    });

    // Process {{sales_banner}}, {{discount_banner}}, {{product_banner}}, {{image}}, {{video}}
    // All rendered via internal template logic (not shown here — handled at build/render stage)
}
