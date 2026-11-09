Run `yarn test:dom` with a Puppeteer-compatible Chrome installed. To use an existing
browser, set `PUPPETEER_EXECUTABLE_PATH` to its executable.

The tests compile the actual marker, cluster and ruler components in both VDOM
and Vapor modes and run them in headless Chrome. They use the real library helpers
and a local SDK substitute that moves marker containers into map wrappers and
detaches those wrappers. No network or Yandex API key is required.

The cluster zoom regression also uses the installed `@yandex/ymaps3-clusterer`
implementation and checks its reuse of cached collections after zooming away and
back. Its Vapor case mounts a pure `createVaporApp` fixture.

Covered behavior includes keyed reordering, reactive slots and attributes,
conditional content, updates outside the viewport, ruler point insertion and
deletion, editable state, preview slots, events, and cleanup on unmount.
Root-prop checks cover the original DOM structure, class normalization, in-place
style changes, attribute removal, boolean DOM properties, handler replacement,
and listener cleanup on retained marker elements.
These checks do not replace testing against the live Yandex Maps SDK.

For a CPU profile of mounting and updating 30,000 markers, run
`MARKER_BENCHMARK=current yarn test:dom`. Use `MARKER_BENCHMARK=original` to
compile the marker from Git HEAD instead, with the same current Vue runtime and
map substitute. These are comparative measurements, not timing assertions.
