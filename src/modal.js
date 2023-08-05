// @ts-check
/// <reference path="../node_modules/@types/jquery/JQueryStatic.d.ts"/>
/// <reference path="main.js" />
/// <reference path="helpers.js" />

$(() => {
  const $modal = $('#code-modal');
  const $modalDialog = $modal.find('dialog');
  const $ctrlCodeHtml = $('#code-html');
  const $ctrlCodeCss = $('#code-css');

  $('#btn-get-code').on('click', openDialog);

  //All the 'copy' buttons
  $('.btn-copy').on('click', (event) => {
    const tgtSelector = $(event.target).data('target');
    if (tgtSelector) {
      navigator.clipboard.writeText($(tgtSelector).get(0).value).then(
        () => {},
        () => {
          alert('could not copy text, please select and copy it manually!');
        }
      );
    }
  });

  $modalDialog.on('click', function (ev) {
    closeDialog(ev, this);
  });

  $modalDialog.find('.btn-close').on('click', function (ev) {
    closeDialog(ev, this);
  });

  function openDialog() {
    writeCodeToFields();
    $modal.show();
    $modalDialog.get(0)?.showModal();
  }

  function closeDialog(ev, self) {
    if (ev.target == self) {
      $modalDialog.get(0)?.close();
      $modal.hide();
    }
  }

  function writeCodeToFields() {
    const $svgFilter = $('#demo-output svg filter');

    const textureStylesStr = Object.keys(textureStyles)
      //skip the mix-blend-mode if it's set to 'normal'
      .filter(
        (k) => k !== 'mix-blend-mode' || (k === 'mix-blend-mode' && textureStyles[k] !== 'normal')
      )
      .map((k) => {
        const val = textureStyles[k];
        if (k === 'filter') {
          const filterValues = getPropsAsCssString(val);
          return `  filter: url(#${$svgFilter.attr('id')}) ${filterValues};`;
        }
        return `  ${k}: ${val};`;
      })
      .join('\n');

    $ctrlCodeHtml.val(
      `<svg xmlns="${svgNs}" class="hidden-svg">${prettyIndentHtml(
        '\n' + $svgFilter.get(0)?.outerHTML
      )}</svg>`
    );

    $ctrlCodeCss.val(`.bg-texture {
  position: relative;
}
.bg-texture::after {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 100%;
  z-index: -1;

${textureStylesStr}
}
.hidden-svg {
  height: 0px;
  width: 0px;
  overflow: hidden;
  opacity: 0;
  position: absolute;
  z-index: -999;
  left: 0;
  top: 0;
}`);
  }

  function prettyIndentHtml(htmlStr) {
    const tagLevels = {
      filter: 2,
      feTurbulence: 4,
      feSpecularLighting: 4,
      feDiffuseLighting: 4,
      feDistantLight: 6,
      fePointLight: 6,
      feSpotLight: 6,
    };

    Object.keys(tagLevels).forEach((k) => {
      const pattern = new RegExp(`\n\\s*(<\\/?${k})`, 'ig');
      htmlStr = htmlStr.replace(pattern, `\n${' '.repeat(tagLevels[k])}$1`);
    });

    return `${htmlStr}\n`;
  }
});
