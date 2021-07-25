const joinUrl = require('url-join');
const { toFactoryAddress } = require('@arcblock/did-util');
const { isValidFactory } = require('@ocap/asset');

const env = require('./env');
const { wallet } = require('./auth');
const { toBNStr } = require('./utils');

const getFactoryItx = (price, serverUrl) => {
  const itx = {
    name: 'FactoryDemoVIPFactory',
    description: 'Factory to mint VIP passport for Hash Express',
    settlement: 'instant',
    limit: 0,
    trustedIssuers: [],
    input: {
      value: toBNStr(price),
      tokens: [],
      assets: [],
      variables: [],
    },
    output: {
      issuer: '{{ctx.issuer.id}}',
      parent: '{{ctx.factory}}',
      moniker: 'FactoryDemoVIP',
      readonly: true,
      transferrable: true,
      data: {
        type: 'vc',
        value: {
          '@context': 'https://schema.arcblock.io/v0.1/context.jsonld',
          id: '{{input.id}}',
          tag: ['nft-factory-demo'],
          type: ['VerifiableCredential', 'NFTPassport', 'FactoryDemoPassport'],
          issuer: {
            id: '{{ctx.issuer.id}}',
            pk: '{{ctx.issuer.pk}}',
            name: '{{ctx.issuer.name}}',
          },
          issuanceDate: '{{input.issuanceDate}}',
          expirationDate: '{{input.expirationDate}}',
          credentialSubject: {
            id: '{{ctx.owner}}',
            passport: {
              name: 'member',
              title: 'VIP',
            },
            display: {
              type: 'url',
              content: joinUrl(serverUrl, '/api/nft/display'), // accept asset-did in query param
            },
          },
          credentialStatus: {
            id: joinUrl(serverUrl, '/api/nft/status'),
            type: 'NFTStatusList2021',
            scope: 'public',
          },
          proof: {
            type: '{{input.proofType}}',
            created: '{{input.issuanceDate}}',
            proofPurpose: 'assertionMethod',
            jws: '{{input.signature}}',
          },
        },
      },
    },
    data: {
      type: 'json',
      value: {},
    },
    hooks: [
      {
        name: 'mint',
        type: 'contract',
        hook: `transfer("${env.appId}","${toBNStr(price)}")`,
      },
    ],
  };

  isValidFactory(itx);

  const factoryAddress = toFactoryAddress(itx);
  itx.address = factoryAddress;

  return itx;
};

const getFactoryDisplay = (
  issuerName,
  title,
  issuerDid
) => `<svg width="317" height="200" viewBox="0 0 317 200" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect x="0.5" y="0.5" width="316" height="199" rx="7.5" fill="url(#paint0_linear)" />
<path d="M26.1973 155H25.0723V146.469H26.1973V155ZM31.7812 153.318C31.7812 153.025 31.6699 152.799 31.4473 152.639C31.2285 152.475 30.8438 152.334 30.293 152.217C29.7461 152.1 29.3105 151.959 28.9863 151.795C28.666 151.631 28.4277 151.436 28.2715 151.209C28.1191 150.982 28.043 150.713 28.043 150.4C28.043 149.881 28.2617 149.441 28.6992 149.082C29.1406 148.723 29.7031 148.543 30.3867 148.543C31.1055 148.543 31.6875 148.729 32.1328 149.1C32.582 149.471 32.8066 149.945 32.8066 150.523H31.7168C31.7168 150.227 31.5898 149.971 31.3359 149.756C31.0859 149.541 30.7695 149.434 30.3867 149.434C29.9922 149.434 29.6836 149.52 29.4609 149.691C29.2383 149.863 29.127 150.088 29.127 150.365C29.127 150.627 29.2305 150.824 29.4375 150.957C29.6445 151.09 30.0176 151.217 30.5566 151.338C31.0996 151.459 31.5391 151.604 31.875 151.771C32.2109 151.939 32.459 152.143 32.6191 152.381C32.7832 152.615 32.8652 152.902 32.8652 153.242C32.8652 153.809 32.6387 154.264 32.1855 154.607C31.7324 154.947 31.1445 155.117 30.4219 155.117C29.9141 155.117 29.4648 155.027 29.0742 154.848C28.6836 154.668 28.377 154.418 28.1543 154.098C27.9355 153.773 27.8262 153.424 27.8262 153.049H28.9102C28.9297 153.412 29.0742 153.701 29.3438 153.916C29.6172 154.127 29.9766 154.232 30.4219 154.232C30.832 154.232 31.1602 154.15 31.4062 153.986C31.6562 153.818 31.7812 153.596 31.7812 153.318ZM37.9688 153.318C37.9688 153.025 37.8574 152.799 37.6348 152.639C37.416 152.475 37.0312 152.334 36.4805 152.217C35.9336 152.1 35.498 151.959 35.1738 151.795C34.8535 151.631 34.6152 151.436 34.459 151.209C34.3066 150.982 34.2305 150.713 34.2305 150.4C34.2305 149.881 34.4492 149.441 34.8867 149.082C35.3281 148.723 35.8906 148.543 36.5742 148.543C37.293 148.543 37.875 148.729 38.3203 149.1C38.7695 149.471 38.9941 149.945 38.9941 150.523H37.9043C37.9043 150.227 37.7773 149.971 37.5234 149.756C37.2734 149.541 36.957 149.434 36.5742 149.434C36.1797 149.434 35.8711 149.52 35.6484 149.691C35.4258 149.863 35.3145 150.088 35.3145 150.365C35.3145 150.627 35.418 150.824 35.625 150.957C35.832 151.09 36.2051 151.217 36.7441 151.338C37.2871 151.459 37.7266 151.604 38.0625 151.771C38.3984 151.939 38.6465 152.143 38.8066 152.381C38.9707 152.615 39.0527 152.902 39.0527 153.242C39.0527 153.809 38.8262 154.264 38.373 154.607C37.9199 154.947 37.332 155.117 36.6094 155.117C36.1016 155.117 35.6523 155.027 35.2617 154.848C34.8711 154.668 34.5645 154.418 34.3418 154.098C34.123 153.773 34.0137 153.424 34.0137 153.049H35.0977C35.1172 153.412 35.2617 153.701 35.5312 153.916C35.8047 154.127 36.1641 154.232 36.6094 154.232C37.0195 154.232 37.3477 154.15 37.5938 153.986C37.8438 153.818 37.9688 153.596 37.9688 153.318ZM44.3789 154.373C43.957 154.869 43.3379 155.117 42.5215 155.117C41.8457 155.117 41.3301 154.922 40.9746 154.531C40.623 154.137 40.4453 153.555 40.4414 152.785V148.66H41.5254V152.756C41.5254 153.717 41.916 154.197 42.6973 154.197C43.5254 154.197 44.0762 153.889 44.3496 153.271V148.66H45.4336V155H44.4023L44.3789 154.373ZM50.7773 153.318C50.7773 153.025 50.666 152.799 50.4434 152.639C50.2246 152.475 49.8398 152.334 49.2891 152.217C48.7422 152.1 48.3066 151.959 47.9824 151.795C47.6621 151.631 47.4238 151.436 47.2676 151.209C47.1152 150.982 47.0391 150.713 47.0391 150.4C47.0391 149.881 47.2578 149.441 47.6953 149.082C48.1367 148.723 48.6992 148.543 49.3828 148.543C50.1016 148.543 50.6836 148.729 51.1289 149.1C51.5781 149.471 51.8027 149.945 51.8027 150.523H50.7129C50.7129 150.227 50.5859 149.971 50.332 149.756C50.082 149.541 49.7656 149.434 49.3828 149.434C48.9883 149.434 48.6797 149.52 48.457 149.691C48.2344 149.863 48.123 150.088 48.123 150.365C48.123 150.627 48.2266 150.824 48.4336 150.957C48.6406 151.09 49.0137 151.217 49.5527 151.338C50.0957 151.459 50.5352 151.604 50.8711 151.771C51.207 151.939 51.4551 152.143 51.6152 152.381C51.7793 152.615 51.8613 152.902 51.8613 153.242C51.8613 153.809 51.6348 154.264 51.1816 154.607C50.7285 154.947 50.1406 155.117 49.418 155.117C48.9102 155.117 48.4609 155.027 48.0703 154.848C47.6797 154.668 47.373 154.418 47.1504 154.098C46.9316 153.773 46.8223 153.424 46.8223 153.049H47.9062C47.9258 153.412 48.0703 153.701 48.3398 153.916C48.6133 154.127 48.9727 154.232 49.418 154.232C49.8281 154.232 50.1562 154.15 50.4023 153.986C50.6523 153.818 50.7773 153.596 50.7773 153.318ZM55.9043 155.117C55.0449 155.117 54.3457 154.836 53.8066 154.273C53.2676 153.707 52.998 152.951 52.998 152.006V151.807C52.998 151.178 53.1172 150.617 53.3555 150.125C53.5977 149.629 53.9336 149.242 54.3633 148.965C54.7969 148.684 55.2656 148.543 55.7695 148.543C56.5938 148.543 57.2344 148.814 57.6914 149.357C58.1484 149.9 58.377 150.678 58.377 151.689V152.141H54.082C54.0977 152.766 54.2793 153.271 54.627 153.658C54.9785 154.041 55.4238 154.232 55.9629 154.232C56.3457 154.232 56.6699 154.154 56.9355 153.998C57.2012 153.842 57.4336 153.635 57.6328 153.377L58.2949 153.893C57.7637 154.709 56.9668 155.117 55.9043 155.117ZM55.7695 149.434C55.332 149.434 54.9648 149.594 54.668 149.914C54.3711 150.23 54.1875 150.676 54.1172 151.25H57.293V151.168C57.2617 150.617 57.1133 150.191 56.8477 149.891C56.582 149.586 56.2227 149.434 55.7695 149.434ZM62.7012 149.633C62.5371 149.605 62.3594 149.592 62.168 149.592C61.457 149.592 60.9746 149.895 60.7207 150.5V155H59.6367V148.66H60.6914L60.709 149.393C61.0645 148.826 61.5684 148.543 62.2207 148.543C62.4316 148.543 62.5918 148.57 62.7012 148.625V149.633Z"
  fill="#999999" />
<text x="262" y="42" font-size="14" fill="#222222" style='text-anchor:middle;font-weight:bold;font-family: Roboto;'>${title}</text>
<text x="24" y="44" font-size="18" fill="#222222" style='width: 100'>${issuerName}</text>
<path d="M234 24.25H289V23.75H234V24.25ZM292.75 28V47H293.25V28H292.75ZM289 50.75H234V51.25H289V50.75ZM230.25 47V28H229.75V47H230.25ZM234 50.75C231.929 50.75 230.25 49.0711 230.25 47H229.75C229.75 49.3472 231.653 51.25 234 51.25V50.75ZM292.75 47C292.75 49.0711 291.071 50.75 289 50.75V51.25C291.347 51.25 293.25 49.3472 293.25 47H292.75ZM289 24.25C291.071 24.25 292.75 25.9289 292.75 28H293.25C293.25 25.6528 291.347 23.75 289 23.75V24.25ZM234 23.75C231.653 23.75 229.75 25.6528 229.75 28H230.25C230.25 25.9289 231.929 24.25 234 24.25V23.75Z"
  fill="#999999" />
<path fill-rule="evenodd" clip-rule="evenodd"
  d="M25.9318 163.527H41.0926C41.8394 163.527 42.4449 164.077 42.4449 164.756V173.244C42.4449 173.923 41.8394 174.473 41.0926 174.473H25.9318C25.185 174.473 24.5795 173.923 24.5795 173.244V173.172C24.5795 173.012 24.4498 172.882 24.2898 172.882C24.1297 172.882 24 173.012 24 173.172V173.244C24 174.214 24.8649 175 25.9318 175H41.0926C42.1595 175 43.0244 174.214 43.0244 173.244V164.756C43.0244 163.786 42.1595 163 41.0926 163H25.9318C24.8649 163 24 163.786 24 164.756V164.828C24 164.988 24.1297 165.118 24.2898 165.118C24.4498 165.118 24.5795 164.988 24.5795 164.828V164.756C24.5795 164.077 25.185 163.527 25.9318 163.527ZM24.0612 172.012C24.1079 172.053 24.1604 172.073 24.2187 172.073H26.5375C27.4008 172.073 28.057 171.877 28.5062 171.485C28.9612 171.087 29.2033 170.481 29.2325 169.667C29.2383 169.503 29.2412 169.281 29.2412 169C29.2412 168.719 29.2383 168.494 29.2325 168.324C29.2091 167.545 28.9612 166.951 28.4887 166.541C28.0162 166.132 27.3512 165.927 26.4937 165.927H24.2187C24.1604 165.927 24.1079 165.947 24.0612 165.988C24.0204 166.029 24 166.082 24 166.146V171.854C24 171.912 24.0204 171.965 24.0612 172.012ZM27.3425 170.537C27.1616 170.718 26.8787 170.809 26.4937 170.809H25.575V167.191H26.45C26.835 167.191 27.1237 167.285 27.3162 167.472C27.5146 167.66 27.6196 167.949 27.6312 168.341C27.6429 168.505 27.6487 168.722 27.6487 168.991C27.6487 169.26 27.6429 169.48 27.6312 169.65C27.6196 170.054 27.5233 170.349 27.3425 170.537ZM30.3246 172.012C30.3713 172.053 30.4238 172.073 30.4821 172.073H31.6546C31.7188 172.073 31.7713 172.053 31.8121 172.012C31.8588 171.971 31.8821 171.918 31.8821 171.854V166.146C31.8821 166.082 31.8588 166.029 31.8121 165.988C31.7713 165.947 31.7188 165.927 31.6546 165.927H30.4821C30.4238 165.927 30.3713 165.947 30.3246 165.988C30.2838 166.029 30.2634 166.082 30.2634 166.146V171.854C30.2634 171.912 30.2838 171.965 30.3246 172.012ZM33.319 172.073C33.2607 172.073 33.2082 172.053 33.1615 172.012C33.1207 171.965 33.1003 171.912 33.1003 171.854V166.146C33.1003 166.082 33.1207 166.029 33.1615 165.988C33.2082 165.947 33.2607 165.927 33.319 165.927H35.594C36.4515 165.927 37.1165 166.132 37.589 166.541C38.0615 166.951 38.3094 167.545 38.3327 168.324C38.3385 168.494 38.3415 168.719 38.3415 169C38.3415 169.281 38.3385 169.503 38.3327 169.667C38.3035 170.481 38.0615 171.087 37.6065 171.485C37.1573 171.877 36.5011 172.073 35.6377 172.073H33.319ZM35.594 170.809C35.979 170.809 36.2619 170.718 36.4427 170.537C36.6236 170.349 36.7198 170.054 36.7315 169.65C36.7431 169.48 36.749 169.26 36.749 168.991C36.749 168.722 36.7431 168.505 36.7315 168.341C36.7198 167.949 36.6148 167.66 36.4165 167.472C36.224 167.285 35.9352 167.191 35.5502 167.191H34.6752V170.809H35.594ZM40.1082 168.282C39.8193 168.282 39.5811 168.047 39.5811 167.759C39.5811 167.47 39.8193 167.235 40.1082 167.235C40.3972 167.235 40.6354 167.47 40.6354 167.759C40.6354 168.047 40.3972 168.282 40.1082 168.282ZM40.1082 171.017C39.8193 171.017 39.5811 170.782 39.5811 170.493C39.5811 170.205 39.8193 169.97 40.1082 169.97C40.3972 169.97 40.6354 170.205 40.6354 170.493C40.6354 170.782 40.3972 171.017 40.1082 171.017Z"
  fill="#999999" />
<text x="48" y="174" font-size="12" fill="#777777">${issuerDid}</text>
<rect x="0.5" y="0.5" width="316" height="199" rx="7.5" stroke="#E7ECF6" />
<defs>
  <linearGradient id="paint0_linear" x1="158.5" y1="0" x2="158.5" y2="200" gradientUnits="userSpaceOnUse">
    <stop stop-color="#F3F6FC" />
    <stop offset="1" stop-color="#EEF1F7" />
  </linearGradient>
</defs>
</svg>`;

module.exports = {
  factoryItx: getFactoryItx(env.vipPrice, env.serverUrl),
  factoryDisplay: getFactoryDisplay(env.appName, 'VIP', wallet.toAddress()),
};
