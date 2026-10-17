import { n as e } from "./rolldown-runtime-DF993M8W.js";
import { Q as t, x as n } from "./common-DMSVbaSb.js";
import { t as r } from "./platform-D4TUCh2P.js";
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/models/heap_snapshot/ChildrenProvider.ts
var i = /* @__PURE__ */ e({}), a = /* @__PURE__ */ e({
	AggregateForDiff: () => m,
	AllocationNodeCallers: () => l,
	AllocationStackFrame: () => d,
	ComparatorConfig: () => g,
	Diff: () => h,
	Edge: () => p,
	HeapSnapshotProgressEvent: () => o,
	ItemsRange: () => _,
	Location: () => S,
	Node: () => f,
	NodeFilter: () => y,
	Samples: () => x,
	SearchConfig: () => b,
	SerializedAllocationNode: () => u,
	StaticData: () => v,
	baseSystemDistance: () => s,
	baseUnreachableDistance: () => c
}), o = {
	Update: "ProgressUpdate",
	BrokenSnapshot: "BrokenSnapshot"
}, s = 1e8, c = s * 2, l = class {
	nodesWithSingleCaller;
	branchingCallers;
	constructor(e, t) {
		this.nodesWithSingleCaller = e, this.branchingCallers = t;
	}
}, u = class {
	id;
	name;
	scriptName;
	scriptId;
	line;
	column;
	count;
	size;
	liveCount;
	liveSize;
	hasChildren;
	constructor(e, t, n, r, i, a, o, s, c, l, u) {
		this.id = e, this.name = t, this.scriptName = n, this.scriptId = r, this.line = i, this.column = a, this.count = o, this.size = s, this.liveCount = c, this.liveSize = l, this.hasChildren = u;
	}
}, d = class {
	functionName;
	scriptName;
	scriptId;
	line;
	column;
	constructor(e, t, n, r, i) {
		this.functionName = e, this.scriptName = t, this.scriptId = n, this.line = r, this.column = i;
	}
}, f = class {
	id;
	name;
	distance;
	nodeIndex;
	retainedSize;
	selfSize;
	type;
	canBeQueried = !1;
	detachedDOMTreeNode = !1;
	isAddedNotRemoved = null;
	ignored = !1;
	constructor(e, t, n, r, i, a, o) {
		this.id = e, this.name = t, this.distance = n, this.nodeIndex = r, this.retainedSize = i, this.selfSize = a, this.type = o;
	}
}, p = class {
	name;
	node;
	type;
	edgeIndex;
	isAddedNotRemoved = null;
	constructor(e, t, n, r) {
		this.name = e, this.node = t, this.type = n, this.edgeIndex = r;
	}
}, m = class {
	name;
	indexes;
	ids;
	selfSizes;
	constructor() {
		this.name = "", this.indexes = [], this.ids = [], this.selfSizes = [];
	}
}, h = class {
	name;
	addedCount = 0;
	removedCount = 0;
	addedSize = 0;
	removedSize = 0;
	deletedIndexes = [];
	addedIndexes = [];
	countDelta;
	sizeDelta;
	constructor(e) {
		this.name = e;
	}
}, g = class {
	fieldName1;
	ascending1;
	fieldName2;
	ascending2;
	constructor(e, t, n, r) {
		this.fieldName1 = e, this.ascending1 = t, this.fieldName2 = n, this.ascending2 = r;
	}
}, _ = class {
	startPosition;
	endPosition;
	totalLength;
	items;
	constructor(e, t, n, r) {
		this.startPosition = e, this.endPosition = t, this.totalLength = n, this.items = r;
	}
}, v = class {
	nodeCount;
	rootNodeIndex;
	totalSize;
	maxJSObjectId;
	constructor(e, t, n, r) {
		this.nodeCount = e, this.rootNodeIndex = t, this.totalSize = n, this.maxJSObjectId = r;
	}
}, y = class {
	minNodeId;
	maxNodeId;
	allocationNodeId;
	filterName;
	constructor(e, t) {
		this.minNodeId = e, this.maxNodeId = t;
	}
	equals(e) {
		return this.minNodeId === e.minNodeId && this.maxNodeId === e.maxNodeId && this.allocationNodeId === e.allocationNodeId && this.filterName === e.filterName;
	}
}, b = class {
	query;
	caseSensitive;
	wholeWord;
	isRegex;
	shouldJump;
	jumpBackward;
	constructor(e, t, n, r, i, a) {
		this.query = e, this.caseSensitive = t, this.wholeWord = n, this.isRegex = r, this.shouldJump = i, this.jumpBackward = a;
	}
	toSearchRegex(e) {
		throw Error("Unsupported operation on search config");
	}
}, x = class {
	timestamps;
	lastAssignedIds;
	sizes;
	constructor(e, t, n) {
		this.timestamps = e, this.lastAssignedIds = t, this.sizes = n;
	}
}, S = class {
	scriptId;
	lineNumber;
	columnNumber;
	constructor(e, t, n) {
		this.scriptId = e, this.lineNumber = t, this.columnNumber = n;
	}
}, C = /* @__PURE__ */ e({
	HeapSnapshotLoaderProxy: () => E,
	HeapSnapshotProviderProxy: () => O,
	HeapSnapshotProxy: () => D,
	HeapSnapshotProxyObject: () => T,
	HeapSnapshotWorkerProxy: () => w
}), w = class e extends t {
	eventHandler;
	nextObjectId = 1;
	nextCallId = 1;
	callbacks = /* @__PURE__ */ new Map();
	previousCallbacks = /* @__PURE__ */ new Set();
	worker;
	interval;
	workerUrl;
	constructor(e, t) {
		super(), this.eventHandler = e, this.workerUrl = t, this.worker = r.createWorker(t ?? new URL("../../entrypoints/heap_snapshot_worker/heap_snapshot_worker-entrypoint.js", new URL("models/heap_snapshot/HeapSnapshotProxy.js", typeof document < "u" ? document.baseURI : new URL("../../", self.location.href).href).href).href), this.worker.onmessage = this.messageReceived.bind(this);
	}
	createLoader(e, t) {
		let n = this.nextObjectId++, r = new E(this, n, e, t);
		return this.postMessage({
			callId: this.nextCallId++,
			disposition: "createLoader",
			objectId: n
		}), r;
	}
	dispose() {
		this.worker.terminate(), clearInterval(this.interval);
	}
	disposeObject(e) {
		this.postMessage({
			callId: this.nextCallId++,
			disposition: "dispose",
			objectId: e
		});
	}
	evaluateForTest(e, t) {
		let n = this.nextCallId++;
		this.callbacks.set(n, t), this.postMessage({
			callId: n,
			disposition: "evaluateForTest",
			source: e
		});
	}
	callFactoryMethod(e, t, n, r, i, ...a) {
		let o = this.nextCallId++, s = this.nextObjectId++;
		return e ? (this.callbacks.set(o, (t) => {
			e(t ? new r(this, s) : null);
		}), this.postMessage({
			callId: o,
			disposition: "factory",
			objectId: t,
			methodName: n,
			methodArguments: a,
			newObjectId: s
		}, i), null) : (this.postMessage({
			callId: o,
			disposition: "factory",
			objectId: t,
			methodName: n,
			methodArguments: a,
			newObjectId: s
		}, i), new r(this, s));
	}
	callMethod(e, t, n, ...r) {
		let i = this.nextCallId++;
		e && this.callbacks.set(i, e), this.postMessage({
			callId: i,
			disposition: "method",
			objectId: t,
			methodName: n,
			methodArguments: r
		});
	}
	startCheckingForLongRunningCalls() {
		this.interval ||= (this.checkLongRunningCalls(), window.setInterval(this.checkLongRunningCalls.bind(this), 300));
	}
	checkLongRunningCalls() {
		for (let e of this.previousCallbacks) this.callbacks.has(e) || this.previousCallbacks.delete(e);
		let t = !!this.previousCallbacks.size;
		this.dispatchEventToListeners(e.Events.WAIT, t);
		for (let e of this.callbacks.keys()) this.previousCallbacks.add(e);
	}
	setupForSecondaryInit(e) {
		let t = this.nextCallId++, n = new Promise((e) => {
			this.callbacks.set(t, e);
		});
		return this.postMessage({
			callId: t,
			disposition: "setupForSecondaryInit",
			objectId: this.nextObjectId++
		}, [e]), n;
	}
	messageReceived(e) {
		let t = e.data;
		if (t.eventName) {
			this.eventHandler && this.eventHandler(t.eventName, t.data);
			return;
		}
		if (t.error) {
			n.instance().error(`An error occurred when a call to method '${t.errorMethodName}' was requested`), n.instance().error(t.errorCallStack), this.callbacks.delete(t.callId);
			return;
		}
		let r = this.callbacks.get(t.callId);
		r && (this.callbacks.delete(t.callId), r(t.result));
	}
	postMessage(e, t) {
		this.worker.postMessage(e, t);
	}
};
(function(e) {
	e.Events = /* @__PURE__ */ function(e) {
		return e.WAIT = "Wait", e;
	}({});
})(w ||= {});
var T = class {
	worker;
	objectId;
	constructor(e, t) {
		this.worker = e, this.objectId = t;
	}
	dispose() {
		this.worker.disposeObject(this.objectId);
	}
	callFactoryMethod(e, t, ...n) {
		return this.worker.callFactoryMethod(null, String(this.objectId), e, t, [], ...n);
	}
	callFactoryMethodPromise(e, t, n, ...r) {
		return new Promise((i) => this.worker.callFactoryMethod(i, String(this.objectId), e, t, n, ...r));
	}
	callMethodPromise(e, ...t) {
		return new Promise((n) => this.worker.callMethod(n, String(this.objectId), e, ...t));
	}
}, E = class extends T {
	profileUid;
	snapshotReceivedCallback;
	constructor(e, t, n, r) {
		super(e, t), this.profileUid = n, this.snapshotReceivedCallback = r;
	}
	async write(e) {
		await this.callMethodPromise("write", e);
	}
	async close() {
		await this.callMethodPromise("close");
		let e = new w(() => {}, this.worker.workerUrl), t = new MessageChannel();
		await e.setupForSecondaryInit(t.port2);
		let n = await this.callFactoryMethodPromise("buildSnapshot", D, [t.port1]);
		e.dispose(), this.dispose(), n.setProfileUid(this.profileUid), await n.updateStaticData(), this.snapshotReceivedCallback(n);
	}
}, D = class extends T {
	staticData;
	profileUid;
	constructor(e, t) {
		super(e, t), this.staticData = null;
	}
	search(e, t) {
		return this.callMethodPromise("search", e, t);
	}
	interfaceDefinitions() {
		return this.callMethodPromise("interfaceDefinitions");
	}
	aggregatesWithFilter(e) {
		return this.callMethodPromise("aggregatesWithFilter", e);
	}
	aggregatesForDiff(e) {
		return this.callMethodPromise("aggregatesForDiff", e);
	}
	calculateSnapshotDiff(e, t) {
		return this.callMethodPromise("calculateSnapshotDiff", e, t);
	}
	nodeClassKey(e) {
		return this.callMethodPromise("nodeClassKey", e);
	}
	createEdgesProvider(e) {
		return this.callFactoryMethod("createEdgesProvider", O, e);
	}
	createRetainingEdgesProvider(e) {
		return this.callFactoryMethod("createRetainingEdgesProvider", O, e);
	}
	createAddedNodesProvider(e, t) {
		return this.callFactoryMethod("createAddedNodesProvider", O, e, t);
	}
	createDeletedNodesProvider(e) {
		return this.callFactoryMethod("createDeletedNodesProvider", O, e);
	}
	createNodesProvider(e) {
		return this.callFactoryMethod("createNodesProvider", O, e);
	}
	createNodesProviderForClass(e, t) {
		return this.callFactoryMethod("createNodesProviderForClass", O, e, t);
	}
	allocationTracesTops() {
		return this.callMethodPromise("allocationTracesTops");
	}
	allocationNodeCallers(e) {
		return this.callMethodPromise("allocationNodeCallers", e);
	}
	allocationStack(e) {
		return this.callMethodPromise("allocationStack", e);
	}
	dispose() {
		throw Error("Should never be called");
	}
	get nodeCount() {
		return this.staticData ? this.staticData.nodeCount : 0;
	}
	get rootNodeIndex() {
		return this.staticData ? this.staticData.rootNodeIndex : 0;
	}
	async updateStaticData() {
		this.staticData = await this.callMethodPromise("updateStaticData");
	}
	getStatistics() {
		return this.callMethodPromise("getStatistics");
	}
	getLocation(e) {
		return this.callMethodPromise("getLocation", e);
	}
	getSamples() {
		return this.callMethodPromise("getSamples");
	}
	ignoreNodeInRetainersView(e) {
		return this.callMethodPromise("ignoreNodeInRetainersView", e);
	}
	unignoreNodeInRetainersView(e) {
		return this.callMethodPromise("unignoreNodeInRetainersView", e);
	}
	unignoreAllNodesInRetainersView() {
		return this.callMethodPromise("unignoreAllNodesInRetainersView");
	}
	areNodesIgnoredInRetainersView() {
		return this.callMethodPromise("areNodesIgnoredInRetainersView");
	}
	get totalSize() {
		return this.staticData ? this.staticData.totalSize : 0;
	}
	get uid() {
		return this.profileUid;
	}
	setProfileUid(e) {
		this.profileUid = e;
	}
	maxJSObjectId() {
		return this.staticData ? this.staticData.maxJSObjectId : 0;
	}
}, O = class extends T {
	nodePosition(e) {
		return this.callMethodPromise("nodePosition", e);
	}
	isEmpty() {
		return this.callMethodPromise("isEmpty");
	}
	serializeItemsRange(e, t) {
		return this.callMethodPromise("serializeItemsRange", e, t);
	}
	async sortAndRewind(e) {
		await this.callMethodPromise("sortAndRewind", e);
	}
}, k = /* @__PURE__ */ e({
	ChildrenProvider: () => i,
	HeapSnapshotModel: () => a,
	HeapSnapshotProxy: () => C
});
//#endregion
export { v as _, d as a, p as c, S as d, f, u as g, b as h, l as i, o as l, x as m, w as n, g as o, y as p, m as r, h as s, k as t, _ as u, s as v, c as y };
