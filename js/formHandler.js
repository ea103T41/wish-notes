export const LOCAL_STORAGE_KEY = 'wishForm';

export function saveToLocalStorage(inputs) {
    const data = {};
    inputs.forEach(input => {
        data[input.id] = input.type === 'checkbox' ? input.checked : input.value;
    });
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
}

export function restoreFromLocalStorage(inputs) {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!stored) return;
    const data = JSON.parse(stored);
    inputs.forEach(input => {
        if (data.hasOwnProperty(input.id)) {
            if (input.type === 'checkbox') input.checked = data[input.id];
            else input.value = data[input.id];
        }
    });
}

export function validate(input) {
    const value = input.value.trim();
    const isInvalid = (
        (input.classList.contains('is-digit') && !isDigit(value)) ||
        (input.classList.contains('is-email') && !isEmail(value)) ||
        (input.classList.contains('required') && !value)
    );
    toggleInvalidMsg(input.id, isInvalid);
    return !isInvalid;
}

function isDigit(value) {
    return value === '' || /^\d+$/.test(value);
}

function isEmail(value) {
    return value === '' || /^\S+@\S+\.\S+$/.test(value);
}

export function toggleInvalidMsg(id, isInvalid) {
    const _itm = document.getElementById(id);
    const _invalidMsg = _itm.parentNode.querySelector('.invalid-feedback');

    if (_itm && _invalidMsg) {
        _itm.classList.toggle('form-invalid', isInvalid);
        _invalidMsg.classList.toggle('hidden', !isInvalid);
    }
}

export function hasInvalidInput(inputs) {
    for (let i = 0; i < inputs.length; i++) {
        if (inputs[i].classList.contains('form-invalid')) {
            return true;
        }
    }
    return false;
}

export function clearForm(inputs) {
    inputs.forEach(input => {
        if (input.type === 'checkbox') {
            input.checked = false;
        } else {
            input.value = '';
        }
    });
}
