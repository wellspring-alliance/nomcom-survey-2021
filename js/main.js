const scriptURL = 'https://script.google.com/macros/s/AKfycbxm1xOaHKQWR-N29X6zxkxZmmoGhfc6yOJP5V4T5VCA7Prj6F8/exec';

(function({ forms, location }) {
  if (forms[0] && location.search) {
    setFieldsFromParams(forms[0].elements, location.search);
  }
}(document));

function setFieldsFromParams(elements, queryString) {
  new URLSearchParams(queryString).forEach((value, key) => {
    if (elements[key]) {
      elements[key].value = value;
    }
  });
}

function serializeCheckboxes(nodes) {
  return [...nodes].filter(n => n.checked).map(n => n.value).join(', ');
}

async function submitToGoogleSheet(form) {
  const elements = form.elements;
  elements.submit_button.disabled = true;
  elements.nominee_roles.value = serializeCheckboxes(elements.roles);

  try {
    const response = await fetch(scriptURL, {
      method: 'POST',
      body: new FormData(form)
    });
    console.log('Success!', response);
    form.submit();
  } catch (error) {
    console.error(error);
  }
}
