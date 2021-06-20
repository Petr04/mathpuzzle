<template>
  <editor
    :api-key="key"
    :init="tinymce"
    :value="value"
    @input="val => $emit('input', val)"
  />
</template>
<script>
import Editor from '@tinymce/tinymce-vue';
import key from '@/tinyMCEKey';
import {baseURL} from '@/consts';

export default {
  props: ['value'],
  components: {
    Editor,
  },
  data: () => ({
    key,
    tinymce: {
      height: 500,
      menubar: false,
      language: 'ru',
      images_upload_handler(blobInfo, success, failure) {
          let xhr = new XMLHttpRequest();
          xhr.open('POST', 'http://localhost:8000/tinymce_image/upload/');
          xhr.setRequestHeader('X-CSRF-TOKEN', window.csrfToken); // manually set header

          xhr.onload = function() {
              if (xhr.status !== 200) {
                  failure('HTTP Error: ' + xhr.status);
                  return;
              }

              let json = JSON.parse(xhr.responseText);

              if (!json || typeof json.location !== 'string') {
                  failure('Invalid JSON: ' + xhr.responseText);
                  return;
              }

              console.log(json);
              success(baseURL + json.location);
          };

          let formData = new FormData();
          formData.append('file', blobInfo.blob(), blobInfo.filename());

          xhr.send(formData);
      },
      external_plugins: {
        'tiny_mce_wiris': 'https://www.wiris.net/demo/plugins/tiny_mce/plugin.js',
        // Doesn't work: Uncaught SyntaxError: expected expression, got '<':
        // 'tiny_mce_wiris': '/node_modules/@wiris/mathtype-tinymce5/plugin.min.js',
      },
      plugins: [
        'advlist autolink lists link image charmap print preview anchor',
        'searchreplace visualblocks code fullscreen',
        'insertdatetime media table paste code help wordcount'
      ],
      toolbar1:
        'undo redo | formatselect | bold italic backcolor | \
        table | image | bullist numlist outdent indent | removeformat | \
        tiny_mce_wiris_formulaEditor tiny_mce_wiris_formulaEditorChemistry',
    },
  }),
};

</script>
