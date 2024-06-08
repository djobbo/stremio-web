// @ts-expect-error file will be present in the output directory
import * as core from './stremio_core_web.js'
import Bridge from './bridge'
const bridge = new Bridge(self, self);

// @ts-expect-error
self.init = async ({ appVersion, shellVersion }) => {
    // TODO remove the document shim when this PR is merged
    // https://github.com/cfware/babel-plugin-bundled-import-meta/pull/26
    // @ts-expect-error
    self.document = {
        baseURI: self.location.href
    };
    // @ts-expect-error
    self.app_version = appVersion;
    // @ts-expect-error
    self.shell_version = shellVersion;
    // @ts-expect-error
    self.get_location_hash = async () => bridge.call(['location', 'hash'], []);
    // @ts-expect-error
    self.local_storage_get_item = async (key) => bridge.call(['localStorage', 'getItem'], [key]);
    // @ts-expect-error
    self.local_storage_set_item = async (key, value) => bridge.call(['localStorage', 'setItem'], [key, value]);
    // @ts-expect-error
    self.local_storage_remove_item = async (key) => bridge.call(['localStorage', 'removeItem'], [key]);
    const { default: initialize_api, initialize_runtime, get_state, get_debug_state, dispatch, analytics, decode_stream } = core;
    // @ts-expect-error
    self.getState = get_state;
    // @ts-expect-error
    self.getDebugState = get_debug_state;
    // @ts-expect-error
    self.dispatch = dispatch;
    // @ts-expect-error
    self.analytics = analytics;
    // @ts-expect-error
    self.decodeStream = decode_stream;
    await initialize_api();
    await initialize_runtime((event) => bridge.call(['onCoreEvent'], [event]));
};
