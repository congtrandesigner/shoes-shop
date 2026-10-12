const FACEBOOK_APP_ID = '27322287334080189';

export const loadFacebookSdk = () =>
  new Promise((resolve) => {
    if (window.FB) {
      resolve(window.FB);
      return;
    }
    window.fbAsyncInit = () => {
      window.FB.init({
        appId: FACEBOOK_APP_ID,
        cookie: true,
        xfbml: false,
        version: 'v23.0',
      });
      resolve(window.FB);
    };
    const script = document.createElement('script');
    script.src = 'https://connect.facebook.net/en_US/sdk.js';
    script.async = true;
    document.body.appendChild(script);
  });

export const getFacebookToken = async () => {
  const FB = await loadFacebookSdk();
  return new Promise((resolve, reject) => {
    FB.login(
      (res) => {
        if (res.authResponse) {
          resolve(res.authResponse.accessToken);
        } else {
          reject(new Error('Bạn đã hủy đăng nhập Facebook'));
        }
      },
      { scope: 'email' }
    );
  });
};
