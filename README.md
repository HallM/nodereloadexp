# Node Reloading Experiments

These experiments are aimed at creating a PHP-like developer experience
in Node: edit, save, see changes.
Currently, Node requires restarting the entire server to view any changes.
Tools such as `nodemon`, `pm2`, and `forever` help mitigate the issue
by automatically restarting the server when a file changes.
The two downsides I wished to tackle were:
- servers which require a lengthy restart
- source changes across multiple files which may require
  manual shut down, edit, restart. Otherwise, the server may crash or worse,
  be left in an inconsistent state that could cause data corruption.

## The variations

Two minor variations appear in each experiment: how far to take the concept.

### Per-route require

The first variation only allows changes to what occurs in a route.
This was the first thing to be attempted and does not require any
special bootstrap to start the server. On the other hand, this does not
allow for any changes to be made to the Express middlewares.

### Bootstrapping

A server bootstrap is possible by creating the most basic Express application
which simply has one middleware: to load an Express.Router and execute on that.
This allows for changes to be made to the entire middleware stack,
adding or removing routes, and all kinds of changes. This implementation does
not permit changing the port the Express server runs on as that is defined in
the bootstrap.

## The approaches

The experiment focuses on clearing the require cache when loading a module.
There are four approaches that are being considered. Other approaches may
exist and hopefully would be added for comparison.

### Require hook

- factory-routes.js
- factory-bootstrap.js > factory-bootstrap-router.js

The require hook overrides the default require implementation
to clear the cache when `require()` is called.
The require hook would only exist in non-production mode to
retain performance in production.

This method does require the developer to call require within routes or
to use a bootstrap which reloads the entire Express app.

### Separate require function - using Freshy

- fresh-routes.js
- fresh-bootstrap.js > fresh-bootstrap-router.js

Similar to the require hook, but allows some to be cached, some to be fresh.

This method does require the developer to use a different require
function for specific items, otherwise memory very quickly grows.
Generally, these things freshly required may be just controllers.
Any new requires added in will be called and cached for future.

### Require-factory loading

- factory-routes.js
- factory-bootstrap.js > factory-bootstrap-router.js

The require factory is a variation on the Require hook method.
The use of a factory was attempted in order to reduce the number of
times `require.resolve` would be called. In the end, there is not a large
difference between this method and the more simple require-hook.
The primary benefit is the ability to allow mixing cache-using and
cache-busting. A separate `require` could have sufficed in this instance.

### vm.runInNewContext

- vm-routes.js
- vm-bootstrap.js > vm-bootstrap-router.js

Running the entire portion in a VM has the added benefit of the entire server
not crashing. Each request can be isolated from each other for a performance
penalty. This may have a benefit by running in isolated contexts by mitigating
the harm a global may do across requests. I am uncertain if this option has
any memory benefits as I do not know if `vm.runInNewContext` will free all
memory of that `vm` after completion.

Interestingly, the require from a `vm` does not carry to required modules.
Therefore, this method may not provide the desired benefit. The vm has to
be combined with another method. For benchmarks, we leverage the freshy
method to display the difference of the `vm`. Even if the freshy method is
slower than other methods, this exists only as a comparison in VM vs no-VM.

## Hello-world performance

These benchmarks are simple Hello World style and completely ignore any IO
and other real world cases. We simply want to see the overhead added by each
approach. A `controller.js` file is shared by all implementations that is
mounted to `/`. The implementation simple sends "Hello world".

All benchmarks were gathered using `ab -n 1000 -c 100 http://localhost:3000/`

The following data was gathered on a late 2014 Mac Mini
- 2.6 GHz Core i5
- 8 GB DDR3-1600
- 1 TB spinning hard disk (no SSD)

- (NP) - non production (reload enabled)
- (P) - production, uses bypass logic for best performance
- (P+VM) - production, uses bypass logic, but still uses a `vm` per request

| Experiment             | Req/s | 50%   | 95%   | 99%   | Memory |
| ---------------------- | -----:| -----:| -----:| -----:| ------:|
| Normal (Control)       |  2126 |  40ms |  87ms |  99ms |    tbd |
| Hook-routes (NP)       |  1442 |  61ms | 107ms | 119ms |    tbd |
| Hook-bootstrap (NP)    |     x |  does |   not | comp- |   lete |
| Hook-routes (P)        |  1808 |  45ms |  93ms | 116ms |    tbd |
| Hook-bootstrap (P)     |  1895 |  47ms |  84ms |  97ms |    tbd |
| Fresh-routes (NP)      |  1268 |  69ms | 120ms | 149ms |    tbd |
| Fresh-bootstrap (NP)   |   965 |  99ms | 139ms | 163ms |    tbd |
| Fresh-routes (P)       |  1978 |  43ms |  87ms | 102ms |    tbd |
| Fresh-bootstrap (P)    |  1910 |  42ms |  85ms | 113ms |    tbd |
| Factory-routes (NP)    |  1652 |  51ms |  99ms | 107ms |    tbd |
| Factory-bootstrap (NP) |  1137 |  74ms | 156ms | 195ms |    tbd |
| Factory-routes (P)     |  2158 |  37ms |  83ms |  96ms |    tbd |
| Factory-bootstrap (P)  |  2035 |  40ms |  88ms | 100ms |    tbd |
| VM-routes (NP)         |   638 | 150ms | 188ms | 211ms |    tbd |
| VM-bootstrap (NP)      |   540 | 178ms | 212ms | 236ms |    tbd |
| VM-routes (P+VM)       |   775 | 123ms | 162ms | 172ms |    tbd |
| VM-bootstrap (P+VM)    |   753 | 127ms | 158ms | 169ms |    tbd |
| VM-routes (P)          |  2095 |  40ms |  81ms |  88ms |    tbd |
| VM-bootstrap (P)       |  2093 |  40ms |  80ms |  98ms |    tbd |
