import * as R from 'ramda';
import readPublicKey from './readPublicKey';

describe('readPublicKey', () => {
  function testFunc({ type, pemStr, value }) {
    it(type, () => {
      expect(readPublicKey(pemStr)).toEqual(value);
    });
  }

  const testArr = [
    {
      type: 'BEGIN RSA PUBLIC KEY',
      pemStr: `
-----BEGIN RSA PUBLIC KEY-----
MIIBCgKCAQEAwVACPi9w23mF3tBkdZz+zwrzKOaaQdr01vAbU4E1pvkfj4sqDsm6
lyDONS789sVoD/xCS9Y0hkkC3gtL1tSfTlgCMOOul9lcixlEKzwKENj1Yz/s7daS
an9tqw3bfUV/nqgbhGX81v/+7RFAEd+RwFnK7a+XYl9sluzHRyVVaTTveB2GazTw
Efzk2DWgkBluml8OREmvfraX3bkHZJTKX4EQSjBbbdJ2ZXIsRrYOXfaA+xayEGB+
8hdlLmAjbCVfaigxX0CDqWeR1yFL9kwd9P0NsZRPsmoqVwMbMu7mStFai6aIhc3n
Slv8kg9qv1m6XHVQY3PnEw+QQtqSIXklHwIDAQAB
-----END RSA PUBLIC KEY-----
`,
      value: {
        /* eslint-disable */
        n: BigInt('24403446649145068056824081744112065346446136066297307473868293895086332508101251964919587745984311372853053253457835208829824428441874946556659953519213382748319518214765985662663680818277989736779506318868003755216402538945900388706898101286548187286716959100102939636333452457308619454821845196109544157601096359148241435922125602449263164512290854366930013825808102403072317738266383237191313714482187326643144603633877219028262697593882410403273959074350849923041765639673335775605842311578109726403165298875058941765362622936097839775380070572921007586266115476975819175319995527916042178582540628652481530373407'),
        /* eslint-enable */
        e: BigInt('65537'),
      },
    },
    {
      type: 'PUBLIC KEY',
      pemStr: `
-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAruw2yP/BCcsJliRoW5eB
VBVle9dtjJw+OYED160Wybum9SXtBBLXriwt4rROd9csv0t0OHCaTmRqBcQ0J8fx
hN6/cpR1GWgOZRUAiQxoMnlt0R93LCX/j1dnVa/gVbCjdSxpbrfY2g2L4frzjJvd
l84Kd9ORYjDEAyFnEA7dD556OptgLQQ2e2iVNq8NZLYTzLp5YpOdO1doK+ttrltg
gTCy5SrKeLoCPPbOgGsdxJxyz5KKcZnSLj16yE5HvJQn0CNpRdENvRUXe6tBP78O
39oJ8BTHp9oIjd6XWXAsp2CvK45Ol8wFXGF710w9lwCGNbmNxNYhtIkdqfsEcwR5
JwIDAQAB
-----END PUBLIC KEY-----
`,
      value: {
        /* eslint-disable */
        n: BigInt('22081946531037833540524260580660774032207476521197121128740358761486364763467087828766873972338019078976854986531076484772771735399701424566177039926855356719497736439289455286277202113900509554266057302466528985253648318314129246825219640197356165626774276930672688973278712614800066037531599375044750753580126415613086372604312320014358994394131667022861767539879232149461579922316489532682165746762569651763794500923643656753278887871955676253526661694459370047843286685859688756429293184148202379356802488805862746046071921830921840273062124571073336369210703400985851431491295910187179045081526826572515473914151'),
        /* eslint-enable */
        e: BigInt('65537'),
      },
    },
  ];

  R.forEach(testFunc, testArr);
});