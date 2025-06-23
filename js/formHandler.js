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
    const validators = [
        input.classList.contains('required') && isEmpty(value),
        input.classList.contains('is-digit') && !isOptionalDigit(value),
        input.classList.contains('is-email') && !isOptionalEmail(value),
    ];
    const isInvalid = validators.some(Boolean);
    toggleInvalidMsg(input.id, isInvalid);
    return !isInvalid;
}

function isEmpty(value) {
  return value === '';
}

function isOptionalDigit(value) {
  return isEmpty(value) || /^\d+$/.test(value);
}

function isOptionalEmail(value) {
  return isEmpty(value) || /^\S+@\S+\.\S+$/.test(value);
}

function toggleInvalidMsg(id, isInvalid) {
    const _itm = document.getElementById(id);
    const _invalidMsg = _itm.parentNode.querySelector('.invalid-feedback');

    if (_itm && _invalidMsg) {
        _itm.classList.toggle('form-invalid', isInvalid);
        _invalidMsg.classList.toggle('hidden', !isInvalid);
    }
}

export function hasInvalidInput(inputs) {
    return Array.from(inputs)
        .some(input => input.classList.contains('form-invalid'));
}

export function clearInvalidMsg(input) {
    if (input.classList.contains('form-invalid')) {
        toggleInvalidMsg(input.id);
    }
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
