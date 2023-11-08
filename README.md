# Nextcloud file browser APP written in ReactJS

This is a sketch of the Nextcloud file browser app. You need to modify the Nextcloud server to handle the CORS headers
properly.

## Preparing the Nextcloud server to allow CORS requests

You need to tweak some code in the Nextcloud server instance, because by default it doesn't support the CORS headers,
which are necessary to make requests to Nextcloud from Javascript applications running in the browser.

Step by step, you will need to:

### Allow CORS requests in the Login flow

To make the Login flow working (allow app users to create their profiles in the app by authenticating via Nextcloud
page), you need to do the following things:

* introduce new method `preflightedCors` in the class `\OCP\AppFramework\Controller` (located in 
  `lib/public/AppFramework/Controller.php`) which should look like this:

```php
/**
 * @NoAdminRequired
 * @NoCSRFRequired
 * @PublicPage
 */
public function preflightedCors()
{
    if (isset($this->request->server['HTTP_ORIGIN'])) {
        $origin = $this->request->server['HTTP_ORIGIN'];
    } else {
        $origin = '*';
    }

    $response = new Response();
    $response->addHeader('Access-Control-Allow-Origin', $origin);
    $response->addHeader('Access-Control-Allow-Methods', '*');
    $response->addHeader('Access-Control-Allow-Headers', '*');
    $response->addHeader('Access-Control-Max-Age', '86400');
    $response->addHeader('Access-Control-Allow-Credentials', 'false');
    return $response;
}
```

* register new route for `OPTIONS` method in the file `core/routes.php`:

```php
[
  'name' => 'ClientFlowLoginV2#preflightedCors', 
  'url' => '/login/v2{path}',
  'verb' => 'OPTIONS', 
  'requirements' => ['path' => '.*']
],
```

* locate the class file `core/Controller/ClientFlowLoginV2Controller.php`, and:
* add `@CORS` annotation to the
  method `\OC\Core\Controller\ClientFlowLoginV2Controller::public function poll(string $token): JSONResponse`
* add `@CORS` annotation to the
  method `\OC\Core\Controller\ClientFlowLoginV2Controller::public function init(): JSONResponse`

### Allow CORS requests in the webdav files API

Open the `remote.php` file and find a block that looks like this

```php
if (\OCP\Util::needUpgrade()) {
    // since the behavior of apps or remotes are unpredictable during
    // an upgrade, return a 503 directly
    throw new RemoteException('Service unavailable', 503);
}
```

Under this block, you need to add the following code:

```php
// Allow from any origin
if (isset($_SERVER['HTTP_ORIGIN'])) {
    // Decide if the origin in $_SERVER['HTTP_ORIGIN'] is one
    // you want to allow, and if so:
    header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Max-Age: 86400');    // cache for 1 day
}

// Access-Control headers are received during OPTIONS requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD']))
        // may also be using PATCH, HEAD etc
        header("Access-Control-Allow-Methods: *");

    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']))
        header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");

    exit(0);
}
```

### Allow CORS requests for thumbnail requests

* In the class `\OCA\Files\Controller\ApiController` (`apps/files/lib/Controller/ApiController.php`), find the method 
  `public function getThumbnail($x, $y, $file)` and add the `@CORS` annotation to it.
* Register new route in `apps/files/appinfo/routes.php` by adding the following to the `routes` array declaration:

```php
[
    'name' => 'API#preflightedCors',
    'url' => '/api/v1/{path}',
    'verb' => 'OPTIONS',
    'requirements' => ['path' => '.*']
],
```

And that's it. From now on, you should be able to register new profile in the app and browse the Nextcluod content from it!

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more
information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will
remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right
into your project so you have full control over them. All of the commands except `eject` will still work, but they will
point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you
shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't
customize it when you are ready for it.

## Learn More

You can learn more in
the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved
here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved
here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved
here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved
here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved
here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved
here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
