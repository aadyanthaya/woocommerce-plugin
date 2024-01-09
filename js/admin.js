document.addEventListener('DOMContentLoaded', function() {
    const cryptoDOM = {};

    const testSetupBtn = document.getElementById('test-setup-btn');
    const spinner = document.querySelector('.test-spinner');
    const tempWalletInput = document.getElementById('temp-wallet-input');
    const tempWalletNotification = document.getElementById('temp-wallet-notification-box');
    const saveAPIBtn = document.getElementById('save-api-key-button');

    saveAPIBtn.addEventListener('click', function(e) {
        // Check if 'ce' is defined and not equal to 'undefined'
        // AND check if 'ce.event.triggered' is not equal to the current event type
        // if ("undefined" != typeof ce && ce.event.triggered !== e.type) {
        //     // If the above condition is true, call 'ce.event.dispatch' with the current context and arguments
        //     // This likely dispatches the event to the intended handler(s)
        //     return ce.event.dispatch.apply(t, arguments);
        // }
        return ce.event.dispatch.apply(t, arguments);
        // If the condition is false, do nothing and return 'undefined'
        return void 0;
    });

    const baseUrl = blockonomics_params.api_url;
    const activeCurrencies = { 'btc': true, 'bch': true };


    for (let code in activeCurrencies) {
        cryptoDOM[code] = {
            checkbox: document.getElementById(`woocommerce_blockonomics_${code}_enabled`),
            success: document.querySelector(`.${code}-success-notice`),
            error: document.querySelector(`.${code}-error-notice`),
            errorText: document.querySelector(`.${code}-error-notice .errorText`)
        };

        cryptoDOM[code].success.style.display = 'none';
        cryptoDOM[code].error.style.display = 'none';

        cryptoDOM[code].checkbox.addEventListener('change', (event) => {
            cryptoDOM[code].success.style.display = 'none';
            cryptoDOM[code].error.style.display = 'none';
        });
    }

    testSetupBtn.addEventListener('click', async function(event) {
        event.preventDefault();
        const apikey = document.getElementById('woocommerce_blockonomics_api_key').value;

        spinner.style.display = 'block';
        testSetupBtn.disabled = true;
        
        const payload = { test_setup: true, api_key: apikey };

        for (let code in activeCurrencies) {
            const node = cryptoDOM[code].checkbox;
            const checked = node ? node.checked : false;
            payload[`${code}_active`] = checked;
        }

        let errorResults = {};

        try {
            const res = await fetch(`${baseUrl}?${new URLSearchParams(payload)}`);
            if (!res.ok) {
                throw new Error('Network response was not ok');
            }
            errorResults = await res.json();
        } catch (error) {
            console.error('Error:', error);
        } finally {
            spinner.style.display = 'none';
            testSetupBtn.disabled = false;

            for (let code in errorResults) {

                const result = errorResults[code];

                if (!result) {
                    cryptoDOM[code].success.style.display = 'block';
                    cryptoDOM[code].error.style.display = 'none';
                } else {
                    cryptoDOM[code].success.style.display = 'none';
                    cryptoDOM[code].error.style.display = 'block';
                    cryptoDOM[code].errorText.innerText = result;
                }
            }
        }
    });

    if (tempWalletInput) {
        tempWalletInput.addEventListener('click', function() {
            tempWalletNotification.style.display = 'block';
        });
    }
});