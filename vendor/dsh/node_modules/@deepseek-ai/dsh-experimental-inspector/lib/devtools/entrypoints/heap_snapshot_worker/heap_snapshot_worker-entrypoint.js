import { n as e } from "../../chunks/rolldown-runtime-DF993M8W.js";
import { Qt as t, Wt as n, q as r, qt as i } from "../../chunks/common-DMSVbaSb.js";
import { t as a } from "../../chunks/platform-D4TUCh2P.js";
import { t as o } from "../../chunks/MapUtilities-C6UNTa-e.js";
import { s } from "../../chunks/text_utils-DWSliayn.js";
import { c } from "../../chunks/StringUtilities-CMDxNrEc.js";
import { _ as l, a as u, c as d, d as f, f as p, g as m, i as h, l as g, m as _, r as v, s as y, t as b, u as x, v as S, y as C } from "../../chunks/heap_snapshot-CTdRQlts.js";
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/core/platform/TypedArrayUtilities.ts
function w() {
	return new D();
}
function T(e, t) {
	try {
		if (t !== void 0 && e > t) throw RangeError();
		return new ee(e);
	} catch {
		return new E(e, t);
	}
}
var ee = class extends Uint32Array {
	getValue(e) {
		return this[e];
	}
	setValue(e, t) {
		this[e] = t;
	}
	asUint32ArrayOrFail() {
		return this;
	}
	asArrayOrFail() {
		throw Error("Not an array");
	}
}, E = class {
	#e;
	#t;
	length;
	constructor(e, t) {
		this.#e = [], this.length = e;
		let n = 1;
		for (;;) {
			n *= 2, this.#t = Math.ceil(e / n);
			try {
				if (t !== void 0 && this.#t > t) throw RangeError();
				for (let e = 0; e < n; ++e) this.#e[e] = new Uint32Array(this.#t);
				return;
			} catch (e) {
				if (this.#t < 1e6) throw e;
			}
		}
	}
	getValue(e) {
		if (e >= 0 && e < this.length) {
			let t = this.#t;
			return this.#e[Math.floor(e / t)][e % t];
		}
		return this.#e[0][-1];
	}
	setValue(e, t) {
		if (e >= 0 && e < this.length) {
			let n = this.#t;
			this.#e[Math.floor(e / n)][e % n] = t;
		}
	}
	asUint32ArrayOrFail() {
		throw Error("Not a Uint32Array");
	}
	asArrayOrFail() {
		throw Error("Not an array");
	}
}, D = class extends Array {
	getValue(e) {
		return this[e];
	}
	setValue(e, t) {
		this[e] = t;
	}
	asUint32ArrayOrFail() {
		throw Error("Not a Uint32Array");
	}
	asArrayOrFail() {
		return this;
	}
};
function O(e) {
	return new k(e);
}
var k = class extends Uint8Array {
	constructor(e) {
		super(typeof e == "number" ? Math.ceil(e / 8) : e);
	}
	getBit(e) {
		return !!(this[e >> 3] & 1 << (e & 7));
	}
	setBit(e) {
		this[e >> 3] |= 1 << (e & 7);
	}
	clearBit(e) {
		this[e >> 3] &= ~(1 << (e & 7));
	}
	previous(e) {
		for (; e !== e >> 3 << 3;) if (--e, this.getBit(e)) return e;
		let t = (e >> 3) - 1;
		for (; t >= 0 && this[t] === 0;) --t;
		if (t < 0) return -1;
		for (e = (t << 3) + 7; e >= t << 3; --e) if (this.getBit(e)) return e;
		throw Error("Unreachable");
	}
}, A = /* @__PURE__ */ e({
	AllocationProfile: () => j,
	BottomUpAllocationNode: () => te,
	FunctionAllocationInfo: () => N,
	TopDownAllocationNode: () => M
}), j = class {
	#e;
	#t = 1;
	#n = [];
	#r = {};
	#i = {};
	#a = {};
	#o = null;
	constructor(e, t) {
		this.#e = e.strings, this.#s(e), this.#c(e, t);
	}
	#s(e) {
		let t = this.#e, n = e.snapshot.meta.trace_function_info_fields, r = n.indexOf("name"), i = n.indexOf("script_name"), a = n.indexOf("script_id"), o = n.indexOf("line"), s = n.indexOf("column"), c = n.length, l = e.trace_function_infos, u = l.length, d = this.#n = Array(u / c), f = 0;
		for (let e = 0; e < u; e += c) d[f++] = new N(t[l[e + r]], t[l[e + i]], l[e + a], l[e + o], l[e + s]);
	}
	#c(e, t) {
		let n = e.trace_tree, r = this.#n, i = this.#i, a = e.snapshot.meta.trace_node_fields, o = a.indexOf("id"), s = a.indexOf("function_info_index"), c = a.indexOf("count"), l = a.indexOf("size"), u = a.indexOf("children"), d = a.length;
		function f(e, n, a) {
			let p = r[e[n + s]], m = e[n + o], h = t[m], g = h ? h.count : 0, _ = h ? h.size : 0, v = new M(m, p, e[n + c], e[n + l], g, _, a);
			i[m] = v, p.addTraceTopNode(v);
			let y = e[n + u];
			for (let e = 0; e < y.length; e += d) v.children.push(f(y, e, v));
			return v;
		}
		return f(n, 0, null);
	}
	serializeTraceTops() {
		if (this.#o) return this.#o;
		let e = this.#o = [], t = this.#n;
		for (let n = 0; n < t.length; n++) {
			let r = t[n];
			if (r.totalCount === 0) continue;
			let i = this.#t++, a = n === 0;
			e.push(this.#d(i, r, r.totalCount, r.totalSize, r.totalLiveCount, r.totalLiveSize, !a)), this.#a[i] = r;
		}
		return e.sort(function(e, t) {
			return t.size - e.size;
		}), e;
	}
	serializeCallers(e) {
		let t = this.#l(e), n = [];
		for (; t.callers().length === 1;) t = t.callers()[0], n.push(this.#u(t));
		let r = [], i = t.callers();
		for (let e = 0; e < i.length; e++) r.push(this.#u(i[e]));
		return new h(n, r);
	}
	serializeAllocationStack(e) {
		let t = this.#i[e], n = [];
		for (; t;) {
			let e = t.functionInfo;
			n.push(new u(e.functionName, e.scriptName, e.scriptId, e.line, e.column)), t = t.parent;
		}
		return n;
	}
	traceIds(e) {
		return this.#l(e).traceTopIds;
	}
	#l(e) {
		let t = this.#r[e];
		return t || (t = this.#a[e].bottomUpRoot(), delete this.#a[e], this.#r[e] = t), t;
	}
	#u(e) {
		let t = this.#t++;
		return this.#r[t] = e, this.#d(t, e.functionInfo, e.allocationCount, e.allocationSize, e.liveCount, e.liveSize, e.hasCallers());
	}
	#d(e, t, n, r, i, a, o) {
		return new m(e, t.functionName, t.scriptName, t.scriptId, t.line, t.column, n, r, i, a, o);
	}
}, M = class {
	id;
	functionInfo;
	allocationCount;
	allocationSize;
	liveCount;
	liveSize;
	parent;
	children = [];
	constructor(e, t, n, r, i, a, o) {
		this.id = e, this.functionInfo = t, this.allocationCount = n, this.allocationSize = r, this.liveCount = i, this.liveSize = a, this.parent = o;
	}
}, te = class e {
	functionInfo;
	allocationCount = 0;
	allocationSize = 0;
	liveCount = 0;
	liveSize = 0;
	traceTopIds = [];
	#e = [];
	constructor(e) {
		this.functionInfo = e;
	}
	addCaller(t) {
		let n = t.functionInfo, r;
		for (let e = 0; e < this.#e.length; e++) {
			let t = this.#e[e];
			if (t.functionInfo === n) {
				r = t;
				break;
			}
		}
		return r || (r = new e(n), this.#e.push(r)), r;
	}
	callers() {
		return this.#e;
	}
	hasCallers() {
		return this.#e.length > 0;
	}
}, N = class {
	functionName;
	scriptName;
	scriptId;
	line;
	column;
	totalCount = 0;
	totalSize = 0;
	totalLiveCount = 0;
	totalLiveSize = 0;
	#e = [];
	#t;
	constructor(e, t, n, r, i) {
		this.functionName = e, this.scriptName = t, this.scriptId = n, this.line = r, this.column = i;
	}
	addTraceTopNode(e) {
		e.allocationCount !== 0 && (this.#e.push(e), this.totalCount += e.allocationCount, this.totalSize += e.allocationSize, this.totalLiveCount += e.liveCount, this.totalLiveSize += e.liveSize);
	}
	bottomUpRoot() {
		return this.#e.length ? (this.#t || this.#n(), this.#t ?? null) : null;
	}
	#n() {
		this.#t = new te(this);
		for (let e = 0; e < this.#e.length; e++) {
			let t = this.#e[e], n = this.#t, r = t.allocationCount, i = t.allocationSize, a = t.liveCount, o = t.liveSize, s = t.id;
			for (; n.allocationCount += r, n.allocationSize += i, n.liveCount += a, n.liveSize += o, n.traceTopIds.push(s), t = t.parent, t !== null;) n = n.addCaller(t);
		}
	}
}, ne = /* @__PURE__ */ e({
	HeapSnapshot: () => J,
	HeapSnapshotEdge: () => P,
	HeapSnapshotEdgeIndexProvider: () => I,
	HeapSnapshotEdgeIterator: () => ie,
	HeapSnapshotEdgesProvider: () => X,
	HeapSnapshotFilteredIterator: () => V,
	HeapSnapshotIndexRangeIterator: () => B,
	HeapSnapshotItemProvider: () => Y,
	HeapSnapshotNode: () => R,
	HeapSnapshotNodeIndexProvider: () => F,
	HeapSnapshotNodeIterator: () => z,
	HeapSnapshotNodesProvider: () => Z,
	HeapSnapshotProgress: () => H,
	HeapSnapshotRetainerEdge: () => ae,
	HeapSnapshotRetainerEdgeIndexProvider: () => re,
	HeapSnapshotRetainerEdgeIterator: () => L,
	JSHeapSnapshot: () => Q,
	JSHeapSnapshotEdge: () => fe,
	JSHeapSnapshotNode: () => $,
	JSHeapSnapshotRetainerEdge: () => pe,
	SecondaryInitManager: () => G,
	createJSHeapSnapshotForTesting: () => de
}), P = class e {
	snapshot;
	edges;
	edgeIndex;
	constructor(e, t) {
		this.snapshot = e, this.edges = e.containmentEdges, this.edgeIndex = t || 0;
	}
	clone() {
		return new e(this.snapshot, this.edgeIndex);
	}
	hasStringName() {
		throw Error("Not implemented");
	}
	name() {
		throw Error("Not implemented");
	}
	node() {
		return this.snapshot.createNode(this.nodeIndex());
	}
	nodeIndex() {
		if (this.snapshot.edgeToNodeOffset === void 0) throw Error("edgeToNodeOffset is undefined");
		return this.edges.getValue(this.edgeIndex + this.snapshot.edgeToNodeOffset);
	}
	toString() {
		return "HeapSnapshotEdge: " + this.name();
	}
	type() {
		return this.snapshot.edgeTypes[this.rawType()];
	}
	itemIndex() {
		return this.edgeIndex;
	}
	serialize() {
		return new d(this.name(), this.node().serialize(), this.type(), this.edgeIndex);
	}
	rawType() {
		if (this.snapshot.edgeTypeOffset === void 0) throw Error("edgeTypeOffset is undefined");
		return this.edges.getValue(this.edgeIndex + this.snapshot.edgeTypeOffset);
	}
	isInternal() {
		throw Error("Not implemented");
	}
	isInvisible() {
		throw Error("Not implemented");
	}
	isWeak() {
		throw Error("Not implemented");
	}
	getValueForSorting(e) {
		throw Error("Not implemented");
	}
	nameIndex() {
		throw Error("Not implemented");
	}
}, F = class {
	#e;
	constructor(e) {
		this.#e = e.createNode();
	}
	itemForIndex(e) {
		return this.#e.nodeIndex = e, this.#e;
	}
}, I = class {
	#e;
	constructor(e) {
		this.#e = e.createEdge(0);
	}
	itemForIndex(e) {
		return this.#e.edgeIndex = e, this.#e;
	}
}, re = class {
	#e;
	constructor(e) {
		this.#e = e.createRetainingEdge(0);
	}
	itemForIndex(e) {
		return this.#e.setRetainerIndex(e), this.#e;
	}
}, ie = class {
	#e;
	edge;
	constructor(e) {
		this.#e = e, this.edge = e.snapshot.createEdge(e.edgeIndexesStart());
	}
	hasNext() {
		return this.edge.edgeIndex < this.#e.edgeIndexesEnd();
	}
	item() {
		return this.edge;
	}
	next() {
		if (this.edge.snapshot.edgeFieldsCount === void 0) throw Error("edgeFieldsCount is undefined");
		this.edge.edgeIndex += this.edge.snapshot.edgeFieldsCount;
	}
}, ae = class e {
	snapshot;
	#e;
	#t;
	#n;
	#r;
	#i;
	constructor(e, t) {
		this.snapshot = e, this.setRetainerIndex(t);
	}
	clone() {
		return new e(this.snapshot, this.retainerIndex());
	}
	hasStringName() {
		return this.edge().hasStringName();
	}
	name() {
		return this.edge().name();
	}
	nameIndex() {
		return this.edge().nameIndex();
	}
	node() {
		return this.#a();
	}
	nodeIndex() {
		if (this.#n === void 0) throw Error("retainingNodeIndex is undefined");
		return this.#n;
	}
	retainerIndex() {
		return this.#e;
	}
	setRetainerIndex(e) {
		if (e !== this.#e) {
			if (!this.snapshot.retainingEdges || !this.snapshot.retainingNodes) throw Error("Snapshot does not contain retaining edges or retaining nodes");
			this.#e = e, this.#t = this.snapshot.retainingEdges[e], this.#n = this.snapshot.retainingNodes[e], this.#r = null, this.#i = null;
		}
	}
	set edgeIndex(e) {
		this.setRetainerIndex(e);
	}
	#a() {
		return this.#i ||= this.snapshot.createNode(this.#n), this.#i;
	}
	edge() {
		return this.#r ||= this.snapshot.createEdge(this.#t), this.#r;
	}
	toString() {
		return this.edge().toString();
	}
	itemIndex() {
		return this.#e;
	}
	serialize() {
		let e = this.node(), t = e.serialize();
		return t.distance = this.#o(), t.ignored = this.snapshot.isNodeIgnoredInRetainersView(e.nodeIndex), new d(this.name(), t, this.type(), this.#t);
	}
	type() {
		return this.edge().type();
	}
	isInternal() {
		return this.edge().isInternal();
	}
	getValueForSorting(e) {
		if (e === "!edgeDistance") return this.#o();
		throw Error("Invalid field name");
	}
	#o() {
		return this.snapshot.isEdgeIgnoredInRetainersView(this.#t) ? C : this.node().distanceForRetainersView();
	}
}, L = class {
	#e;
	retainer;
	constructor(e) {
		let t = e.snapshot, n = e.ordinal();
		if (!t.firstRetainerIndex) throw Error("Snapshot does not contain firstRetainerIndex");
		let r = t.firstRetainerIndex[n];
		this.#e = t.firstRetainerIndex[n + 1], this.retainer = t.createRetainingEdge(r);
	}
	hasNext() {
		return this.retainer.retainerIndex() < this.#e;
	}
	item() {
		return this.retainer;
	}
	next() {
		this.retainer.setRetainerIndex(this.retainer.retainerIndex() + 1);
	}
}, R = class {
	snapshot;
	nodeIndex;
	constructor(e, t) {
		this.snapshot = e, this.nodeIndex = t || 0;
	}
	distance() {
		return this.snapshot.nodeDistances[this.nodeIndex / this.snapshot.nodeFieldCount];
	}
	distanceForRetainersView() {
		return this.snapshot.getDistanceForRetainersView(this.nodeIndex);
	}
	className() {
		return this.snapshot.strings[this.classIndex()];
	}
	classIndex() {
		return this.#e() >>> q;
	}
	classKeyInternal() {
		if (this.rawType() !== this.snapshot.nodeObjectType) return this.classIndex();
		let e = this.snapshot.getLocation(this.nodeIndex);
		return e ? `${e.scriptId},${e.lineNumber},${e.columnNumber},${this.className()}` : this.classIndex();
	}
	setClassIndex(e) {
		let t = this.#e();
		if (t &= K, t |= e << q, this.#t(t), this.classIndex() !== e) throw Error("String index overflow");
	}
	dominatorIndex() {
		let e = this.snapshot.nodeFieldCount;
		return this.snapshot.dominatorsTree[this.nodeIndex / this.snapshot.nodeFieldCount] * e;
	}
	edges() {
		return new ie(this);
	}
	edgesCount() {
		return (this.edgeIndexesEnd() - this.edgeIndexesStart()) / this.snapshot.edgeFieldsCount;
	}
	id() {
		throw Error("Not implemented");
	}
	rawName() {
		return this.snapshot.strings[this.rawNameIndex()];
	}
	isRoot() {
		return this.nodeIndex === this.snapshot.rootNodeIndex;
	}
	isUserRoot() {
		throw Error("Not implemented");
	}
	isHidden() {
		throw Error("Not implemented");
	}
	isArray() {
		throw Error("Not implemented");
	}
	isSynthetic() {
		throw Error("Not implemented");
	}
	isDocumentDOMTreesRoot() {
		throw Error("Not implemented");
	}
	name() {
		return this.rawName();
	}
	retainedSize() {
		return this.snapshot.retainedSizes[this.ordinal()];
	}
	retainers() {
		return new L(this);
	}
	retainersCount() {
		let e = this.snapshot, t = this.ordinal();
		return e.firstRetainerIndex[t + 1] - e.firstRetainerIndex[t];
	}
	selfSize() {
		let e = this.snapshot;
		return e.nodes.getValue(this.nodeIndex + e.nodeSelfSizeOffset);
	}
	type() {
		return this.snapshot.nodeTypes[this.rawType()];
	}
	traceNodeId() {
		let e = this.snapshot;
		return e.nodes.getValue(this.nodeIndex + e.nodeTraceNodeIdOffset);
	}
	itemIndex() {
		return this.nodeIndex;
	}
	serialize() {
		return new p(this.id(), this.name(), this.distance(), this.nodeIndex, this.retainedSize(), this.selfSize(), this.type());
	}
	rawNameIndex() {
		let e = this.snapshot;
		return e.nodes.getValue(this.nodeIndex + e.nodeNameOffset);
	}
	edgeIndexesStart() {
		return this.snapshot.firstEdgeIndexes[this.ordinal()];
	}
	edgeIndexesEnd() {
		return this.snapshot.firstEdgeIndexes[this.ordinal() + 1];
	}
	ordinal() {
		return this.nodeIndex / this.snapshot.nodeFieldCount;
	}
	nextNodeIndex() {
		return this.nodeIndex + this.snapshot.nodeFieldCount;
	}
	rawType() {
		let e = this.snapshot;
		return e.nodes.getValue(this.nodeIndex + e.nodeTypeOffset);
	}
	isFlatConsString() {
		if (this.rawType() !== this.snapshot.nodeConsStringType) return !1;
		for (let e = this.edges(); e.hasNext(); e.next()) {
			let t = e.edge;
			if (!t.isInternal()) continue;
			let n = t.name();
			if ((n === "first" || n === "second") && t.node().name() === "") return !0;
		}
		return !1;
	}
	#e() {
		let { snapshot: e, nodeIndex: t } = this, n = e.nodeDetachednessAndClassIndexOffset;
		return n === -1 ? e.detachednessAndClassIndexArray[t / e.nodeFieldCount] : e.nodes.getValue(t + n);
	}
	#t(e) {
		let { snapshot: t, nodeIndex: n } = this, r = t.nodeDetachednessAndClassIndexOffset;
		r === -1 ? t.detachednessAndClassIndexArray[n / t.nodeFieldCount] = e : t.nodes.setValue(n + r, e);
	}
	detachedness() {
		return this.#e() & K;
	}
	setDetachedness(e) {
		let t = this.#e();
		t &= ~K, t |= e, this.#t(t);
	}
}, z = class {
	node;
	#e;
	constructor(e) {
		this.node = e, this.#e = e.snapshot.nodes.length;
	}
	hasNext() {
		return this.node.nodeIndex < this.#e;
	}
	item() {
		return this.node;
	}
	next() {
		this.node.nodeIndex = this.node.nextNodeIndex();
	}
}, B = class {
	#e;
	#t;
	#n;
	constructor(e, t) {
		this.#e = e, this.#t = t, this.#n = 0;
	}
	hasNext() {
		return this.#n < this.#t.length;
	}
	item() {
		let e = this.#t[this.#n];
		return this.#e.itemForIndex(e);
	}
	next() {
		++this.#n;
	}
}, V = class {
	#e;
	#t;
	constructor(e, t) {
		this.#e = e, this.#t = t, this.skipFilteredItems();
	}
	hasNext() {
		return this.#e.hasNext();
	}
	item() {
		return this.#e.item();
	}
	next() {
		this.#e.next(), this.skipFilteredItems();
	}
	skipFilteredItems() {
		for (; this.#e.hasNext() && this.#t && !this.#t(this.#e.item());) this.#e.next();
	}
}, H = class {
	#e;
	constructor(e) {
		this.#e = e;
	}
	updateStatus(e) {
		this.sendUpdateEvent(r(e));
	}
	updateProgress(e, t, n) {
		let i = ((n ? t / n : 0) * 100).toFixed(0);
		this.sendUpdateEvent(r(e, { PH1: i }));
	}
	reportProblem(e) {
		this.#e && this.#e.sendEvent(g.BrokenSnapshot, e);
	}
	sendUpdateEvent(e) {
		this.#e && this.#e.sendEvent(g.Update, e);
	}
};
function U(e, t) {
	e.length > 100 || e.push(t);
}
function oe(e, t) {
	let n = e.rootNode();
	return t.map((e) => typeof e == "string" ? e : (n.nodeIndex = e, `${n.name()} @${n.id()}`)).join("\n  ");
}
function W(e, t) {
	t.postMessage({ problemReport: e });
}
var G = class {
	argsStep1;
	argsStep2;
	argsStep3;
	constructor(e) {
		let { promise: t, resolve: n } = Promise.withResolvers();
		this.argsStep1 = t;
		let { promise: r, resolve: i } = Promise.withResolvers();
		this.argsStep2 = r;
		let { promise: a, resolve: o } = Promise.withResolvers();
		this.argsStep3 = a;
		let s = (t) => {
			let r = t.data;
			switch (r.step) {
				case 1:
					n(r.args);
					break;
				case 2:
					i(r.args);
					break;
				case 3: o(r.args), e.removeEventListener("message", s);
			}
		};
		e.addEventListener("message", s), e.start(), this.initialize(e);
	}
	async getNodeSelfSizes() {
		return (await this.argsStep3).nodeSelfSizes;
	}
	async initialize(e) {
		try {
			let t = await this.argsStep1, n = J.buildRetainers(t), r = await this.argsStep2, i = {
				...r,
				...t,
				...n,
				essentialEdges: O(r.essentialEdgesBuffer),
				port: e,
				nodeSelfSizesPromise: this.getNodeSelfSizes()
			}, a = await J.calculateDominatorsAndRetainedSizes(i), o = J.buildDominatedNodes({
				...i,
				...a
			}), s = {
				...n,
				...a,
				...o
			};
			e.postMessage({ resultsFromSecondWorker: s }, [
				s.dominatorsTree.buffer,
				s.retainedSizes.buffer,
				s.firstRetainerIndex.buffer,
				s.retainingNodes.buffer,
				s.retainingEdges.buffer,
				s.firstDominatedNodeIndex.buffer,
				s.dominatedNodes.buffer
			]);
		} catch (t) {
			e.postMessage({ error: t + "\n" + t?.stack });
		}
	}
}, K = 3, q = 2, se = 1, ce = 120, le = 2, ue = 1e3, J = class e {
	nodes;
	containmentEdges;
	#e;
	#t;
	#n = null;
	strings;
	#r;
	#i;
	#a = -5;
	rootNodeIndexInternal = 0;
	#o = {};
	#s;
	#c = {};
	#l = {};
	profile;
	nodeTypeOffset;
	nodeNameOffset;
	nodeIdOffset;
	nodeSelfSizeOffset;
	#u;
	nodeTraceNodeIdOffset;
	nodeFieldCount;
	nodeTypes;
	nodeArrayType;
	nodeHiddenType;
	nodeObjectType;
	nodeNativeType;
	nodeStringType;
	nodeConsStringType;
	nodeSlicedStringType;
	nodeCodeType;
	nodeSyntheticType;
	nodeClosureType;
	nodeRegExpType;
	edgeFieldsCount;
	edgeTypeOffset;
	edgeNameOffset;
	edgeToNodeOffset;
	edgeTypes;
	edgeElementType;
	edgeHiddenType;
	edgeInternalType;
	edgeShortcutType;
	edgeWeakType;
	edgeInvisibleType;
	edgePropertyType;
	#d;
	#f;
	#p;
	#m;
	#h;
	nodeCount;
	#g;
	retainedSizes;
	firstEdgeIndexes;
	retainingNodes;
	retainingEdges;
	firstRetainerIndex;
	nodeDistances;
	firstDominatedNodeIndex;
	dominatedNodes;
	dominatorsTree;
	#_;
	nodeDetachednessAndClassIndexOffset;
	#v;
	#y = /* @__PURE__ */ new Set();
	#b = /* @__PURE__ */ new Set();
	#x;
	#S;
	detachednessAndClassIndexArray;
	#C = /* @__PURE__ */ new Map();
	#w;
	constructor(e, t) {
		this.nodes = e.nodes, this.containmentEdges = e.edges, this.#e = e.snapshot.meta, this.#t = e.samples, this.strings = e.strings, this.#r = e.locations, this.#i = t, e.snapshot.root_index && (this.rootNodeIndexInternal = e.snapshot.root_index), this.profile = e, this.#S = O(this.strings.length);
	}
	async initialize(e) {
		let t = this.#e;
		this.nodeTypeOffset = t.node_fields.indexOf("type"), this.nodeNameOffset = t.node_fields.indexOf("name"), this.nodeIdOffset = t.node_fields.indexOf("id"), this.nodeSelfSizeOffset = t.node_fields.indexOf("self_size"), this.#u = t.node_fields.indexOf("edge_count"), this.nodeTraceNodeIdOffset = t.node_fields.indexOf("trace_node_id"), this.nodeDetachednessAndClassIndexOffset = t.node_fields.indexOf("detachedness"), this.nodeFieldCount = t.node_fields.length, this.nodeTypes = t.node_types[this.nodeTypeOffset], this.nodeArrayType = this.nodeTypes.indexOf("array"), this.nodeHiddenType = this.nodeTypes.indexOf("hidden"), this.nodeObjectType = this.nodeTypes.indexOf("object"), this.nodeNativeType = this.nodeTypes.indexOf("native"), this.nodeStringType = this.nodeTypes.indexOf("string"), this.nodeConsStringType = this.nodeTypes.indexOf("concatenated string"), this.nodeSlicedStringType = this.nodeTypes.indexOf("sliced string"), this.nodeCodeType = this.nodeTypes.indexOf("code"), this.nodeSyntheticType = this.nodeTypes.indexOf("synthetic"), this.nodeClosureType = this.nodeTypes.indexOf("closure"), this.nodeRegExpType = this.nodeTypes.indexOf("regexp"), this.edgeFieldsCount = t.edge_fields.length, this.edgeTypeOffset = t.edge_fields.indexOf("type"), this.edgeNameOffset = t.edge_fields.indexOf("name_or_index"), this.edgeToNodeOffset = t.edge_fields.indexOf("to_node"), this.edgeTypes = t.edge_types[this.edgeTypeOffset], this.edgeTypes.push("invisible"), this.edgeElementType = this.edgeTypes.indexOf("element"), this.edgeHiddenType = this.edgeTypes.indexOf("hidden"), this.edgeInternalType = this.edgeTypes.indexOf("internal"), this.edgeShortcutType = this.edgeTypes.indexOf("shortcut"), this.edgeWeakType = this.edgeTypes.indexOf("weak"), this.edgeInvisibleType = this.edgeTypes.indexOf("invisible"), this.edgePropertyType = this.edgeTypes.indexOf("property");
		let n = t.location_fields || [];
		this.#d = n.indexOf("object_index"), this.#f = n.indexOf("script_id"), this.#p = n.indexOf("line"), this.#m = n.indexOf("column"), this.#h = n.length, this.nodeCount = this.nodes.length / this.nodeFieldCount, this.#g = this.containmentEdges.length / this.edgeFieldsCount, this.#i.updateStatus("Building edge indexes…"), this.firstEdgeIndexes = new Uint32Array(this.nodeCount + 1), this.buildEdgeIndexes(), this.#i.updateStatus("Building retainers…");
		let r = this.startInitStep1InSecondThread(e);
		if (this.#i.updateStatus("Propagating DOM state…"), this.propagateDOMState(), this.#i.updateStatus("Calculating node flags…"), this.calculateFlags(), this.#i.updateStatus("Building dominated nodes…"), this.startInitStep2InSecondThread(e), this.#i.updateStatus("Calculating shallow sizes…"), this.calculateShallowSizes(), this.#i.updateStatus("Calculating retained sizes…"), this.startInitStep3InSecondThread(e), this.#i.updateStatus("Calculating distances…"), this.nodeDistances = new Int32Array(this.nodeCount), this.calculateDistances(!1), this.#i.updateStatus("Calculating object names…"), this.calculateObjectNames(), this.applyInterfaceDefinitions(this.inferInterfaceDefinitions()), this.#i.updateStatus("Calculating samples…"), this.buildSamples(), this.#i.updateStatus("Building locations…"), this.buildLocationMap(), this.#i.updateStatus("Calculating retained sizes…"), await this.installResultsFromSecondThread(r), this.#i.updateStatus("Calculating statistics…"), this.calculateStatistics(), this.profile.snapshot.trace_function_count) {
			this.#i.updateStatus("Building allocation statistics…");
			let e = this.nodes.length, t = this.nodeFieldCount, n = this.rootNode(), r = {};
			for (let i = 0; i < e; i += t) {
				n.nodeIndex = i;
				let e = n.traceNodeId(), t = r[e];
				t || (r[e] = t = {
					count: 0,
					size: 0,
					ids: []
				}), t.count++, t.size += n.selfSize(), t.ids.push(n.id());
			}
			this.#_ = new j(this.profile, r);
		}
		this.#i.updateStatus("Finished processing.");
	}
	startInitStep1InSecondThread(e) {
		let t = new Promise((t, n) => {
			let r = (i) => {
				let a = i.data;
				if (a?.problemReport) {
					let e = a.problemReport;
					console.warn(oe(this, e));
				} else a?.resultsFromSecondWorker ? (e.removeEventListener("message", r), t(a.resultsFromSecondWorker)) : a?.error && (e.removeEventListener("message", r), n(a.error));
			};
			e.addEventListener("message", r), e.start();
		}), n = this.#g, { containmentEdges: r, edgeToNodeOffset: i, edgeFieldsCount: a, nodeFieldCount: o } = this, s = new Uint32Array(n);
		for (let e = 0; e < n; ++e) {
			let t = r.getValue(e * a + i);
			if (t % o) throw Error("Invalid toNodeIndex " + t);
			s[e] = t / o;
		}
		let c = {
			edgeToNodeOrdinals: s,
			firstEdgeIndexes: this.firstEdgeIndexes,
			nodeCount: this.nodeCount,
			edgeFieldsCount: this.edgeFieldsCount,
			nodeFieldCount: this.nodeFieldCount
		};
		return e.postMessage({
			step: 1,
			args: c
		}, [s.buffer]), t;
	}
	startInitStep2InSecondThread(e) {
		let t = this.rootNodeIndexInternal / this.nodeFieldCount, n = this.initEssentialEdges(), r = {
			rootNodeOrdinal: t,
			essentialEdgesBuffer: n.buffer
		};
		e.postMessage({
			step: 2,
			args: r
		}, [n.buffer]);
	}
	startInitStep3InSecondThread(e) {
		let { nodes: t, nodeFieldCount: n, nodeSelfSizeOffset: r, nodeCount: i } = this, a = new Uint32Array(i);
		for (let e = 0; e < i; ++e) a[e] = t.getValue(e * n + r);
		let o = { nodeSelfSizes: a };
		e.postMessage({
			step: 3,
			args: o
		}, [a.buffer]);
	}
	async installResultsFromSecondThread(e) {
		let t = await e;
		this.dominatedNodes = t.dominatedNodes, this.dominatorsTree = t.dominatorsTree, this.firstDominatedNodeIndex = t.firstDominatedNodeIndex, this.firstRetainerIndex = t.firstRetainerIndex, this.retainedSizes = t.retainedSizes, this.retainingEdges = t.retainingEdges, this.retainingNodes = t.retainingNodes;
	}
	buildEdgeIndexes() {
		let e = this.nodes, t = this.nodeCount, n = this.firstEdgeIndexes, r = this.nodeFieldCount, i = this.edgeFieldsCount, a = this.#u;
		n[t] = this.containmentEdges.length;
		for (let o = 0, s = 0; o < t; ++o) n[o] = s, s += e.getValue(o * r + a) * i;
	}
	static buildRetainers(e) {
		let { edgeToNodeOrdinals: t, firstEdgeIndexes: n, nodeCount: r, edgeFieldsCount: i, nodeFieldCount: a } = e, o = t.length, s = new Uint32Array(o), c = new Uint32Array(o), l = new Uint32Array(r + 1);
		for (let e = 0; e < o; ++e) {
			let n = t[e];
			++l[n];
		}
		for (let e = 0, t = 0; e < r; e++) {
			let n = l[e];
			l[e] = t, s[t] = n, t += n;
		}
		l[r] = s.length;
		let u = n[0];
		for (let e = 0; e < r; ++e) {
			let r = u;
			u = n[e + 1];
			let o = e * a;
			for (let e = r; e < u; e += i) {
				let n = l[t[e / i]], r = n + --s[n];
				s[r] = o, c[r] = e;
			}
		}
		return {
			retainingNodes: s,
			retainingEdges: c,
			firstRetainerIndex: l
		};
	}
	allNodes() {
		return new z(this.rootNode());
	}
	rootNode() {
		return this.createNode(this.rootNodeIndexInternal);
	}
	get rootNodeIndex() {
		return this.rootNodeIndexInternal;
	}
	get totalSize() {
		return this.rootNode().retainedSize() + (this.profile.snapshot.extra_native_bytes ?? 0);
	}
	createFilter(e) {
		let { minNodeId: t, maxNodeId: n, allocationNodeId: r, filterName: i } = e, a;
		if (typeof r == "number") {
			if (a = this.createAllocationStackFilter(r), !a) throw Error("Unable to create filter");
			a.key = "AllocationNodeId: " + r;
		} else typeof t == "number" && typeof n == "number" ? (a = this.createNodeIdFilter(t, n), a.key = "NodeIdRange: " + t + ".." + n) : i !== void 0 && (a = this.createNamedFilter(i), a.key = "NamedFilter: " + i);
		return a;
	}
	search(e, t) {
		let n = e.query;
		function r(e, t, r) {
			return t.indexOf(n) !== -1 && e.add(r), e;
		}
		let i = e.isRegex ? new RegExp(n) : c(n, "i");
		function a(e, t, n) {
			return i.test(t) && e.add(n), e;
		}
		let o = e.isRegex || !e.caseSensitive, s = o ? a : r, l = this.strings.reduce(s, /* @__PURE__ */ new Set()), u = this.createFilter(t), d = [], f = this.nodes.length, p = this.nodes, m = this.nodeNameOffset, h = this.nodeIdOffset, g = this.nodeFieldCount, _ = this.rootNode();
		for (let e = 0; e < f; e += g) {
			if (_.nodeIndex = e, u && !u(_) || _.selfSize() === 0) continue;
			let t = _.name();
			t === _.rawName() ? l.has(p.getValue(e + m)) && d.push(p.getValue(e + h)) : (o ? i.test(t) : t.indexOf(n) !== -1) && d.push(p.getValue(e + h));
		}
		return d;
	}
	aggregatesWithFilter(e) {
		let t = this.createFilter(e), n = t ? t.key : "allObjects";
		return this.getAggregatesByClassKey(!1, n, t);
	}
	createNodeIdFilter(e, t) {
		function n(n) {
			let r = n.id();
			return r > e && r <= t;
		}
		return n;
	}
	createAllocationStackFilter(e) {
		if (!this.#_) throw Error("No Allocation Profile provided");
		let t = this.#_.traceIds(e);
		if (!t.length) return;
		let n = {};
		for (let e = 0; e < t.length; e++) n[t[e]] = !0;
		function r(e) {
			return !!n[e.traceNodeId()];
		}
		return r;
	}
	createNamedFilter(e) {
		let t = O(this.nodeCount), n = (e) => {
			let n = e.nodeIndex / this.nodeFieldCount;
			return t.getBit(n);
		}, r = (e) => {
			let n = new Int32Array(this.nodeCount);
			for (let e = 0; e < this.nodeCount; ++e) n[e] = this.#a;
			let r = new Uint32Array(this.nodeCount);
			n[this.rootNode().ordinal()] = 0, r[0] = this.rootNode().nodeIndex, this.bfs(r, 1, n, e);
			for (let e = 0; e < this.nodeCount; ++e) n[e] !== this.#a && t.setBit(e);
		}, i = () => {
			for (let e = 0; e < this.nodeCount; ++e) this.nodeDistances[e] === this.#a && t.setBit(e);
		};
		switch (e) {
			case "objectsRetainedByDetachedDomNodes": return r((e, t) => t.node().detachedness() !== 2), i(), (e) => !n(e);
			case "objectsRetainedByConsole": return r((e, t) => !(e.isSynthetic() && t.hasStringName() && t.name().endsWith(" / DevTools console"))), i(), (e) => !n(e);
			case "duplicatedStrings": {
				let e = /* @__PURE__ */ new Map(), r = this.createNode(0);
				for (let n = 0; n < this.nodeCount; ++n) {
					r.nodeIndex = n * this.nodeFieldCount;
					let i = r.rawType();
					if (i === this.nodeStringType || i === this.nodeConsStringType) {
						if (r.isFlatConsString()) continue;
						let n = r.name(), i = e.get(n);
						i === void 0 ? e.set(n, r.nodeIndex) : (t.setBit(i / this.nodeFieldCount), t.setBit(r.nodeIndex / this.nodeFieldCount));
					}
				}
				return n;
			}
			case "objectsRetainedByEventHandlers": {
				let e = this.createNode(0), t = this.nodeFieldCount, a = O(this.nodeCount);
				for (let n = 0; n < this.nodeCount; ++n) if (e.nodeIndex = n * t, e.rawName() === "V8EventListener") {
					let n = this.getEdgeTarget(e, "1");
					if (!n) continue;
					let r = n.nodeIndex / t;
					if (this.getEdgeTarget(n, "code")) {
						a.setBit(r);
						continue;
					}
					let i = !1;
					for (let e = n.edges(); e.hasNext(); e.next()) {
						let n = e.item().node();
						if (this.getEdgeTarget(n, "code")) {
							a.setBit(n.nodeIndex / t), i = !0;
							break;
						}
					}
					i || a.setBit(r);
				}
				return r((e, n) => {
					let r = n.node().nodeIndex / t;
					return !a.getBit(r);
				}), i(), (e) => !n(e);
			}
		}
		throw Error("Invalid filter name");
	}
	getAggregatesByClassKey(e, t, n) {
		let r;
		if (t && this.#c[t]) r = this.#c[t];
		else {
			let e = this.buildAggregates(n);
			this.calculateClassesRetainedSize(e, n), r = Object.create(null);
			for (let [t, n] of e.entries()) {
				let e = this.#T(t);
				r[e] = n;
			}
			t && (this.#c[t] = r);
		}
		return e && (!t || !this.#l[t]) && (this.sortAggregateIndexes(r), t && (this.#l[t] = e)), r;
	}
	allocationTracesTops() {
		return this.#_.serializeTraceTops();
	}
	allocationNodeCallers(e) {
		return this.#_.serializeCallers(e);
	}
	allocationStack(e) {
		let t = this.createNode(e).traceNodeId();
		return t ? this.#_.serializeAllocationStack(t) : null;
	}
	aggregatesForDiff(e) {
		if (this.#s?.interfaceDefinitions === e) return this.#s.aggregates;
		let t = this.#w;
		this.applyInterfaceDefinitions(JSON.parse(e));
		let n = this.getAggregatesByClassKey(!0, "allObjects");
		this.applyInterfaceDefinitions(t ?? []);
		let r = {}, i = this.createNode();
		for (let e in n) {
			let t = n[e].idxs, a = Array(t.length), o = Array(t.length);
			for (let e = 0; e < t.length; e++) i.nodeIndex = t[e], a[e] = i.id(), o[e] = i.selfSize();
			r[e] = {
				name: i.className(),
				indexes: t,
				ids: a,
				selfSizes: o
			};
		}
		return this.#s = {
			interfaceDefinitions: e,
			aggregates: r
		}, r;
	}
	isUserRoot(e) {
		return !0;
	}
	calculateShallowSizes() {}
	calculateDistances(e, t) {
		let n = this.nodeCount;
		if (e) {
			let e = t;
			t = (t, n) => !this.#y.has(n.nodeIndex()) && (!e || e(t, n)), this.#x === void 0 && (this.#x = new Int32Array(n));
		}
		let r = e ? this.#x : this.nodeDistances, i = this.#a;
		for (let e = 0; e < n; ++e) r[e] = i;
		let a = new Uint32Array(this.nodeCount), o = 0;
		for (let e = this.rootNode().edges(); e.hasNext(); e.next()) {
			let t = e.edge.node();
			this.isUserRoot(t) && (r[t.ordinal()] = 1, a[o++] = t.nodeIndex);
		}
		this.bfs(a, o, r, t), r[this.rootNode().ordinal()] = o > 0 ? S : 0, a[0] = this.rootNode().nodeIndex, o = 1, this.bfs(a, o, r, t);
	}
	bfs(e, t, n, r) {
		let i = this.edgeFieldsCount, a = this.nodeFieldCount, o = this.containmentEdges, s = this.firstEdgeIndexes, c = this.edgeToNodeOffset, l = this.edgeTypeOffset, u = this.nodeCount, d = this.edgeWeakType, f = this.#a, p = 0, m = this.createEdge(0), h = this.createNode(0);
		for (; p < t;) {
			let u = e[p++], g = u / a, _ = n[g] + 1, v = s[g], y = s[g + 1];
			h.nodeIndex = u;
			for (let s = v; s < y; s += i) {
				if (o.getValue(s + l) === d) continue;
				let i = o.getValue(s + c), u = i / a;
				n[u] === f && (m.edgeIndex = s, (!r || r(h, m)) && (n[u] = _, e[t++] = i));
			}
		}
		if (t > u) throw Error("BFS failed. Nodes to visit (" + t + ") is more than nodes count (" + u + ")");
	}
	buildAggregates(e) {
		let t = /* @__PURE__ */ new Map(), n = this.nodes, r = n.length, i = this.nodeFieldCount, a = this.nodeSelfSizeOffset, o = this.rootNode(), s = this.nodeDistances;
		for (let c = 0; c < r; c += i) {
			if (o.nodeIndex = c, e && !e(o)) continue;
			let r = n.getValue(c + a);
			if (!r) continue;
			let l = o.classKeyInternal(), u = s[c / i], d = t.get(l);
			d ? (d.distance = Math.min(d.distance, u), ++d.count, d.self += r, d.idxs.push(c)) : (d = {
				count: 1,
				distance: u,
				self: r,
				maxRet: 0,
				name: o.className(),
				idxs: [c]
			}, t.set(l, d));
		}
		for (let e of t.values()) e.idxs = e.idxs.slice();
		return t;
	}
	calculateClassesRetainedSize(e, t) {
		let n = this.rootNodeIndexInternal, r = this.createNode(n), i = [n], a = [-1], o = [], s = /* @__PURE__ */ new Map(), c = this.nodeFieldCount, l = this.dominatedNodes, u = this.firstDominatedNodeIndex;
		for (; i.length;) {
			let n = i.pop();
			r.nodeIndex = n;
			let d = r.classKeyInternal(), f = !!s.get(d), p = n / c, m = u[p], h = u[p + 1];
			!f && (!t || t(r)) && r.selfSize() && (e.get(d).maxRet += r.retainedSize(), m !== h && (s.set(d, !0), a.push(i.length), o.push(d)));
			for (let e = m; e < h; e++) i.push(l[e]);
			let g = i.length;
			for (; a[a.length - 1] === g;) a.pop(), d = o.pop(), s.set(d, !1);
		}
	}
	sortAggregateIndexes(e) {
		let t = this.createNode(), n = this.createNode();
		for (let r in e) e[r].idxs.sort((e, r) => (t.nodeIndex = e, n.nodeIndex = r, t.id() < n.id() ? -1 : 1));
	}
	tryParseWeakMapEdgeName(e) {
		if (this.#S.getBit(e)) return;
		let t = this.strings[e].match(/^\d+(?<duplicatedPart> \/ part of key \(.*? @\d+\) -> value \(.*? @\d+\) pair in WeakMap \(table @(?<tableId>\d+)\))$/);
		if (!t) {
			this.#S.setBit(e);
			return;
		}
		return t.groups;
	}
	computeIsEssentialEdge(e, t, n) {
		let r = this.containmentEdges.getValue(t + this.edgeTypeOffset);
		if (r === this.edgeInternalType) {
			let n = this.containmentEdges.getValue(t + this.edgeNameOffset), r = this.tryParseWeakMapEdgeName(n);
			if (r && this.nodes.getValue(e + this.nodeIdOffset) === parseInt(r.tableId, 10)) return !1;
		}
		if (r === this.edgeWeakType) return !1;
		let i = this.containmentEdges.getValue(t + this.edgeToNodeOffset);
		if (e === i) return !1;
		if (e !== this.rootNodeIndex) {
			if (r === this.edgeShortcutType) return !1;
			let t = n ? n.map : null, a = n ? n.flag : 0, o = e / this.nodeFieldCount, s = i / this.nodeFieldCount, c = !t || t[o] & a;
			if ((!t || t[s] & a) && !c) return !1;
		}
		return !0;
	}
	initEssentialEdges() {
		let e = O(this.#g), { nodes: t, nodeFieldCount: n, edgeFieldsCount: r } = this, i = this.userObjectsMapAndFlag(), a = t.length, o = this.createNode(0);
		for (let t = 0; t < a; t += n) {
			o.nodeIndex = t;
			let n = o.edgeIndexesEnd();
			for (let a = o.edgeIndexesStart(); a < n; a += r) this.computeIsEssentialEdge(t, a, i) && e.setBit(a / r);
		}
		return e;
	}
	static hasOnlyWeakRetainers(e, t) {
		let { retainingEdges: n, edgeFieldsCount: r, firstRetainerIndex: i, essentialEdges: a } = e, o = i[t], s = i[t + 1];
		for (let e = o; e < s; ++e) {
			let t = n[e];
			if (a.getBit(t / r)) return !1;
		}
		return !0;
	}
	static async calculateDominatorsAndRetainedSizes(t) {
		let { nodeCount: n, firstEdgeIndexes: r, edgeFieldsCount: i, nodeFieldCount: a, firstRetainerIndex: o, retainingEdges: s, retainingNodes: c, edgeToNodeOrdinals: l, rootNodeOrdinal: u, essentialEdges: d, nodeSelfSizesPromise: f, port: p } = t;
		function m(e) {
			return d.getBit(e / i);
		}
		let h = n + 1, g = new Uint32Array(h), _ = new Uint32Array(h), v = new Uint32Array(h), y = new Uint32Array(h), b = new Uint32Array(h), x = Array(h), S = 0, C = new Uint32Array(h), w = (e) => {
			let t = e - 1;
			C[t] = r[t];
			let n = e;
			for (; n !== 0;) {
				b[n] === 0 && (b[n] = ++S, v[S] = y[n] = n);
				let e = g[n], t = n - 1;
				for (; C[t] < r[t + 1]; C[t] += i) {
					let a = C[t];
					if (!m(a)) continue;
					let o = l[a / i], s = o + 1;
					if (b[s] === 0) {
						g[s] = n, C[o] = r[o], e = s;
						break;
					}
				}
				n = e;
			}
		}, T = new Uint32Array(h), ee = (e) => {
			let t = 0;
			for (; _[_[e]] !== 0;) T[++t] = e, e = _[e];
			for (; t > 0;) {
				let e = T[t--];
				b[y[_[e]]] < b[y[e]] && (y[e] = y[_[e]]), _[e] = _[_[e]];
			}
		}, E = (e) => _[e] === 0 ? e : (ee(e), y[e]), D = (e, t) => {
			_[t] = e;
		}, O = u + 1;
		S = 0;
		let k = new Uint32Array(h);
		if (w(O), S < n) {
			let r = [`Heap snapshot: ${n - S} nodes are unreachable from the root.`];
			U(r, "The following nodes have only weak retainers:");
			for (let i = 1; i <= n; i++) {
				let n = i - 1;
				b[i] === 0 && e.hasOnlyWeakRetainers(t, n) && (U(r, n * a), g[i] = O, w(i));
			}
			W(r, p);
		}
		if (S < n) {
			let e = [`Heap snapshot: Still found ${n - S} unreachable nodes:`];
			for (let t = 1; t <= n; t++) b[t] === 0 && (U(e, (t - 1) * a), g[t] = O, b[t] = ++S, v[S] = y[t] = t);
			W(e, p);
		}
		for (let e = S; e >= 2; --e) {
			let t = v[e], n = t - 1, r = !0;
			for (let e = o[n]; e < o[n + 1]; e++) {
				if (!m(s[e])) continue;
				r = !1;
				let n = E(c[e] / a + 1);
				b[n] < b[t] && (b[t] = b[n]);
			}
			if (r && (b[t] = b[O]), x[v[b[t]]] === void 0 && (x[v[b[t]]] = /* @__PURE__ */ new Set()), x[v[b[t]]].add(t), D(g[t], t), x[g[t]] !== void 0) {
				for (let e of x[g[t]]) {
					let n = E(e);
					k[e] = b[n] < b[e] ? n : g[t];
				}
				x[g[t]].clear();
			}
		}
		k[0] = k[O] = O;
		for (let e = 2; e <= S; e++) {
			let t = v[e];
			k[t] !== v[b[t]] && (k[t] = k[k[t]]);
		}
		let A = new Uint32Array(n), j = new Float64Array(n), M = await f;
		for (let e = 0; e < n; e++) A[e] = k[e + 1] - 1, j[e] = M[e];
		for (let e = S; e > 1; e--) {
			let t = v[e] - 1, n = A[t];
			j[n] += j[t];
		}
		return {
			dominatorsTree: A,
			retainedSizes: j
		};
	}
	static buildDominatedNodes(e) {
		let { nodeCount: t, dominatorsTree: n, rootNodeOrdinal: r, nodeFieldCount: i } = e, a = new Uint32Array(t + 1), o = new Uint32Array(t - 1), s = 0, c = t;
		if (r === s) s = 1;
		else if (r === c - 1) --c;
		else throw Error("Root node is expected to be either first or last");
		for (let e = s; e < c; ++e) ++a[n[e]];
		let l = 0;
		for (let e = 0, n = t; e < n; ++e) {
			let t = o[l] = a[e];
			a[e] = l, l += t;
		}
		a[t] = o.length;
		for (let e = s; e < c; ++e) {
			let t = a[n[e]];
			t += --o[t], o[t] = e * i;
		}
		return {
			firstDominatedNodeIndex: a,
			dominatedNodes: o
		};
	}
	calculateObjectNames() {
		let { nodes: e, nodeCount: t, nodeNameOffset: n, nodeNativeType: r, nodeHiddenType: i, nodeObjectType: a, nodeCodeType: o, nodeClosureType: s, nodeRegExpType: c } = this;
		this.nodeDetachednessAndClassIndexOffset === -1 && (this.detachednessAndClassIndexArray = new Uint32Array(t));
		let l = /* @__PURE__ */ new Map(), u = (e) => {
			let t = l.get(e);
			return t === void 0 && (t = this.addString(e), l.set(e, t)), t;
		}, d = u("(system)"), f = u("(compiled code)"), p = u("Function"), m = u("RegExp");
		function h(t) {
			switch (t.rawType()) {
				case i: return d;
				case a:
				case r: {
					let r = t.rawName();
					if (r.startsWith("<")) {
						let e = r.indexOf(" ");
						return e !== -1 && (r = r.substring(0, e) + ">"), u(r);
					}
					if (r.startsWith("Detached <")) {
						let e = r.indexOf(" ", 10);
						return e !== -1 && (r = r.substring(0, e) + ">"), u(r);
					}
					return e.getValue(t.nodeIndex + n);
				}
				case o: return f;
				case s: return p;
				case c: return m;
				default: return u("(" + t.type() + ")");
			}
		}
		let g = this.createNode(0);
		for (let e = 0; e < t; ++e) g.setClassIndex(h(g)), g.nodeIndex = g.nextNodeIndex();
	}
	interfaceDefinitions() {
		return JSON.stringify(this.#w ?? []);
	}
	isPlainJSObject(e) {
		return e.rawType() === this.nodeObjectType && e.rawName() === "Object";
	}
	inferInterfaceDefinitions() {
		let { edgePropertyType: e } = this, t = /* @__PURE__ */ new Map(), n = 0;
		for (let r = this.allNodes(); r.hasNext(); r.next()) {
			let i = r.item();
			if (!this.isPlainJSObject(i)) continue;
			++n;
			let a = "{", o = [];
			for (let t = i.edges(); t.hasNext(); t.next()) {
				let n = t.item(), r = n.name();
				if (n.rawType() !== e || r === "__proto__") continue;
				let i = $.formatPropertyName(r);
				if (a.length > se && a.length + i.length > ce) break;
				a.length !== 1 && (a += ", "), a += i, o.push(r);
			}
			if (o.length === 0) continue;
			a += "}";
			let s = t.get(a);
			s ? ++s.count : t.set(a, {
				name: a,
				properties: o,
				count: 1
			});
		}
		let r = Array.from(t.values());
		r.sort((e, t) => t.count - e.count);
		let i = [], a = Math.max(le, n / ue);
		for (let e = 0; e < r.length; ++e) {
			let t = r[e];
			if (t.count < a) break;
			i.push(t);
		}
		return i;
	}
	applyInterfaceDefinitions(e) {
		let { edgePropertyType: t } = this;
		this.#w = e, this.#c = {}, this.#l = {};
		function n(e, t) {
			return !t || e.propertyCount > t.propertyCount ? e : t.propertyCount > e.propertyCount ? t : e.index <= t.index ? e : t;
		}
		let r = {
			next: /* @__PURE__ */ new Map(),
			matchInfo: null,
			greatestNext: null
		};
		for (let t = 0; t < e.length; ++t) {
			let n = e[t], i = n.properties.toSorted(), a = r;
			for (let e of i) {
				let t = a.next, n = t.get(e);
				n || (n = {
					next: /* @__PURE__ */ new Map(),
					matchInfo: null,
					greatestNext: null
				}, t.set(e, n), (a.greatestNext === null || a.greatestNext < e) && (a.greatestNext = e)), a = n;
			}
			a.matchInfo || (a.matchInfo = {
				name: n.name,
				propertyCount: i.length,
				index: t
			});
		}
		let i = {
			name: "Object",
			propertyCount: 0,
			index: Infinity
		};
		for (let e = this.allNodes(); e.hasNext(); e.next()) {
			let a = e.item();
			if (!this.isPlainJSObject(a)) continue;
			let o = [];
			for (let e = a.edges(); e.hasNext(); e.next()) {
				let n = e.item();
				n.rawType() === t && o.push(n.name());
			}
			o.sort();
			let s = /* @__PURE__ */ new Set();
			s.add(r);
			let c = n(i, r.matchInfo);
			for (let e of o) for (let t of Array.from(s.keys())) {
				(t.greatestNext === null || e >= t.greatestNext) && s.delete(t);
				let r = t.next.get(e);
				r && (s.add(r), c = n(c, r.matchInfo));
			}
			let l = c === i ? a.rawNameIndex() : this.#C.get(c.name);
			l === void 0 && (l = this.addString(c.name), this.#C.set(c.name, l)), a.setClassIndex(l);
		}
	}
	iterateFilteredChildren(e, t, n) {
		let r = this.firstEdgeIndexes[e], i = this.firstEdgeIndexes[e + 1];
		for (let e = r; e < i; e += this.edgeFieldsCount) {
			let r = this.containmentEdges.getValue(e + this.edgeToNodeOffset) / this.nodeFieldCount;
			t(this.containmentEdges.getValue(e + this.edgeTypeOffset)) && n(r);
		}
	}
	addString(e) {
		return this.strings.push(e), this.strings.length - 1;
	}
	getEdgeTarget(e, t) {
		for (let n = e.edges(); n.hasNext(); n.next()) {
			let e = n.item();
			if (e.name() === t) return e.node();
		}
		return null;
	}
	propagateDOMState() {
		if (this.nodeDetachednessAndClassIndexOffset === -1) return;
		console.time("propagateDOMState");
		let e = new Uint8Array(this.nodeCount), t = [], n = [], r = /* @__PURE__ */ new Map(), i = this.createNode(0), a = function(e, t) {
			let n = e.nodes.getValue(t + e.nodeNameOffset), i = r.get(n);
			i === void 0 && (i = e.addString("Detached " + e.strings[n]), r.set(n, i)), e.nodes.setValue(t + e.nodeNameOffset, i);
		}, o = function(r, o, s) {
			if (e[o]) return;
			let c = o * r.nodeFieldCount;
			if (r.nodes.getValue(c + r.nodeTypeOffset) !== r.nodeNativeType) {
				e[o] = 1;
				return;
			}
			i.nodeIndex = c, i.setDetachedness(s), s === 1 ? t.push(o) : s === 2 && (a(r, c), n.push(o)), e[o] = 1;
		}, s = function(e, t, n) {
			e.iterateFilteredChildren(t, (t) => ![
				e.edgeHiddenType,
				e.edgeInvisibleType,
				e.edgeWeakType
			].includes(t), (t) => o(e, t, n));
		};
		for (let e = 0; e < this.nodeCount; ++e) {
			i.nodeIndex = e * this.nodeFieldCount;
			let t = i.detachedness();
			t !== 0 && o(this, e, t);
		}
		for (; t.length !== 0;) {
			let e = t.pop();
			s(this, e, 1);
		}
		for (; n.length !== 0;) {
			let e = n.pop();
			i.nodeIndex = e * this.nodeFieldCount, i.detachedness() !== 1 && s(this, e, 2);
		}
		console.timeEnd("propagateDOMState");
	}
	buildSamples() {
		let e = this.#t;
		if (!e?.length) return;
		let t = e.length / 2, r = Array(t), a = Array(t), o = Array(t), s = this.#e.sample_fields.indexOf("timestamp_us"), c = this.#e.sample_fields.indexOf("last_assigned_id");
		for (let n = 0; n < t; n++) r[n] = 0, a[n] = e[2 * n + s] / 1e3, o[n] = e[2 * n + c];
		let l = this.nodes.length, u = this.nodeFieldCount, d = this.rootNode();
		for (let e = 0; e < l; e += u) {
			d.nodeIndex = e;
			let a = d.id();
			if (a % 2 == 0) continue;
			let s = i(o, a, n);
			s !== t && (r[s] += d.selfSize());
		}
		this.#n = new _(a, o, r);
	}
	buildLocationMap() {
		let e = /* @__PURE__ */ new Map(), t = this.#r;
		for (let n = 0; n < t.length; n += this.#h) {
			let r = t[n + this.#d], i = t[n + this.#f], a = t[n + this.#p], o = t[n + this.#m];
			e.set(r, new f(i, a, o));
		}
		this.#v = e;
	}
	getLocation(e) {
		return this.#v.get(e) || null;
	}
	getSamples() {
		return this.#n;
	}
	calculateFlags() {
		throw Error("Not implemented");
	}
	calculateStatistics() {
		throw Error("Not implemented");
	}
	userObjectsMapAndFlag() {
		throw Error("Not implemented");
	}
	calculateSnapshotDiff(e, t) {
		let n = this.#o[e];
		if (n) return n;
		n = {};
		let r = this.getAggregatesByClassKey(!0, "allObjects");
		for (let e in t) {
			let i = t[e], a = this.calculateDiffForClass(i, r[e]);
			a && (n[e] = a);
		}
		let i = new v();
		for (let e in r) {
			if (e in t) continue;
			let a = this.calculateDiffForClass(i, r[e]);
			a && (n[e] = a);
		}
		return this.#o[e] = n, n;
	}
	calculateDiffForClass(e, t) {
		let n = e.ids, r = e.indexes, i = e.selfSizes, a = t ? t.idxs : [], o = 0, s = 0, c = n.length, l = a.length, u = new y(t ? t.name : e.name), d = this.createNode(a[s]);
		for (; o < c && s < l;) {
			let e = n[o];
			e < d.id() ? (u.deletedIndexes.push(r[o]), u.removedCount++, u.removedSize += i[o], ++o) : e > d.id() ? (u.addedIndexes.push(a[s]), u.addedCount++, u.addedSize += d.selfSize(), d.nodeIndex = a[++s]) : (++o, d.nodeIndex = a[++s]);
		}
		for (; o < c;) u.deletedIndexes.push(r[o]), u.removedCount++, u.removedSize += i[o], ++o;
		for (; s < l;) u.addedIndexes.push(a[s]), u.addedCount++, u.addedSize += d.selfSize(), d.nodeIndex = a[++s];
		return u.countDelta = u.addedCount - u.removedCount, u.sizeDelta = u.addedSize - u.removedSize, !u.addedCount && !u.removedCount ? null : u;
	}
	nodeForSnapshotObjectId(e) {
		for (let t = this.allNodes(); t.hasNext(); t.next()) if (t.node.id() === e) return t.node;
		return null;
	}
	#T(e) {
		return typeof e == "number" ? "," + this.strings[e] : e;
	}
	nodeClassKey(e) {
		let t = this.nodeForSnapshotObjectId(e);
		return t ? this.#T(t.classKeyInternal()) : null;
	}
	createEdgesProvider(e) {
		let t = this.createNode(e), n = this.containmentEdgesFilter(), r = new I(this);
		return new X(this, n, t.edges(), r);
	}
	createEdgesProviderForTest(e, t) {
		let n = this.createNode(e), r = new I(this);
		return new X(this, t, n.edges(), r);
	}
	retainingEdgesFilter() {
		return null;
	}
	containmentEdgesFilter() {
		return null;
	}
	createRetainingEdgesProvider(e) {
		let t = this.createNode(e), n = this.retainingEdgesFilter(), r = new re(this);
		return new X(this, n, t.retainers(), r);
	}
	createAddedNodesProvider(e, t) {
		let n = this.#o[e][t];
		return new Z(this, n.addedIndexes);
	}
	createDeletedNodesProvider(e) {
		return new Z(this, e);
	}
	createNodesProviderForClass(e, t) {
		return new Z(this, this.aggregatesWithFilter(t)[e].idxs);
	}
	maxJsNodeId() {
		let e = this.nodeFieldCount, t = this.nodes, n = t.length, r = 0;
		for (let i = this.nodeIdOffset; i < n; i += e) {
			let e = t.getValue(i);
			e % 2 != 0 && r < e && (r = e);
		}
		return r;
	}
	updateStaticData() {
		return new l(this.nodeCount, this.rootNodeIndexInternal, this.totalSize, this.maxJsNodeId());
	}
	ignoreNodeInRetainersView(e) {
		this.#y.add(e), this.calculateDistances(!0), this.#E();
	}
	unignoreNodeInRetainersView(e) {
		this.#y.delete(e), this.#y.size === 0 ? this.#x = void 0 : this.calculateDistances(!0), this.#E();
	}
	unignoreAllNodesInRetainersView() {
		this.#y.clear(), this.#x = void 0, this.#E();
	}
	#E() {
		let e = this.#x;
		if (this.#b.clear(), e === void 0) return;
		let t = new o(), n = this.#a, { nodeCount: r, nodeFieldCount: i } = this, a = this.createNode(0);
		for (let o = 0; o < r; ++o) if (e[o] === n) {
			a.nodeIndex = o * i;
			for (let e = a.edges(); e.hasNext(); e.next()) {
				let n = e.edge;
				if (!n.isInternal()) continue;
				let r = this.tryParseWeakMapEdgeName(n.nameIndex());
				r && t.set(n.nodeIndex(), r.duplicatedPart);
			}
		}
		for (let e of t.keys()) {
			a.nodeIndex = e;
			for (let n = a.retainers(); n.hasNext(); n.next()) {
				let r = n.item();
				if (!r.isInternal()) continue;
				let i = this.tryParseWeakMapEdgeName(r.nameIndex());
				if (i && t.hasValue(e, i.duplicatedPart)) {
					let e = this.retainingEdges[r.itemIndex()];
					this.#b.add(e);
				}
			}
		}
	}
	areNodesIgnoredInRetainersView() {
		return this.#y.size > 0;
	}
	getDistanceForRetainersView(e) {
		let t = e / this.nodeFieldCount, n = (this.#x ?? this.nodeDistances)[t];
		return n === this.#a ? Math.max(0, this.nodeDistances[t]) + C : n;
	}
	isNodeIgnoredInRetainersView(e) {
		return this.#y.has(e);
	}
	isEdgeIgnoredInRetainersView(e) {
		return this.#b.has(e);
	}
}, Y = class {
	iterator;
	#e;
	#t;
	iterationOrder;
	currentComparator;
	#n;
	#r;
	constructor(e, t) {
		this.iterator = e, this.#e = t, this.#t = !e.hasNext(), this.iterationOrder = null, this.currentComparator = null, this.#n = 0, this.#r = 0;
	}
	createIterationOrder() {
		if (!this.iterationOrder) {
			this.iterationOrder = [];
			for (let e = this.iterator; e.hasNext(); e.next()) this.iterationOrder.push(e.item().itemIndex());
		}
	}
	isEmpty() {
		return this.#t;
	}
	serializeItemsRange(e, t) {
		if (this.createIterationOrder(), e > t) throw Error("Start position > end position: " + e + " > " + t);
		if (!this.iterationOrder) throw Error("Iteration order undefined");
		if (t > this.iterationOrder.length && (t = this.iterationOrder.length), this.#n < t && e < this.iterationOrder.length - this.#r && this.currentComparator) {
			let n = this.currentComparator;
			this.sort(n, this.#n, this.iterationOrder.length - 1 - this.#r, e, t - 1), e <= this.#n && (this.#n = t), t >= this.iterationOrder.length - this.#r && (this.#r = this.iterationOrder.length - e);
		}
		let n = e, r = t - e, i = Array(r);
		for (let e = 0; e < r; ++e) {
			let t = this.iterationOrder[n++], r = this.#e.itemForIndex(t);
			i[e] = r.serialize();
		}
		return new x(e, t, this.iterationOrder.length, i);
	}
	sortAndRewind(e) {
		this.currentComparator = e, this.#n = 0, this.#r = 0;
	}
}, X = class extends Y {
	snapshot;
	constructor(e, t, n, r) {
		let i = t ? new V(n, t) : n;
		super(i, r), this.snapshot = e;
	}
	sort(e, n, r, i, a) {
		let o = e.fieldName1, s = e.fieldName2, c = e.ascending1, l = e.ascending2, u = this.iterator.item().clone(), d = u.clone(), f = this.snapshot.createNode(), p = this.snapshot.createNode();
		function m(e, t, n, r) {
			u.edgeIndex = n, d.edgeIndex = r;
			let i = 0;
			if (e === "!edgeName") {
				if (d.name() === "__proto__") return -1;
				if (u.name() === "__proto__") return 1;
				i = u.hasStringName() === d.hasStringName() ? u.name() < d.name() ? -1 : +(u.name() > d.name()) : u.hasStringName() ? -1 : 1;
			} else i = u.getValueForSorting(e) - d.getValueForSorting(e);
			return t ? i : -i;
		}
		function h(e, t, n, r) {
			u.edgeIndex = n, f.nodeIndex = u.nodeIndex();
			let i = f[e]();
			d.edgeIndex = r, p.nodeIndex = d.nodeIndex();
			let a = p[e](), o = i < a ? -1 : +(i > a);
			return t ? o : -o;
		}
		function g(e, t) {
			let n = m(o, c, e, t);
			return n === 0 && (n = m(s, l, e, t)), n === 0 ? e - t : n;
		}
		function _(e, t) {
			let n = m(o, c, e, t);
			return n === 0 && (n = h(s, l, e, t)), n === 0 ? e - t : n;
		}
		function v(e, t) {
			let n = h(o, c, e, t);
			return n === 0 && (n = m(s, l, e, t)), n === 0 ? e - t : n;
		}
		function y(e, t) {
			let n = h(o, c, e, t);
			return n === 0 && (n = h(s, l, e, t)), n === 0 ? e - t : n;
		}
		if (!this.iterationOrder) throw Error("Iteration order not defined");
		function b(e) {
			return e.startsWith("!edge");
		}
		b(o) ? b(s) ? t(this.iterationOrder, g, n, r, i, a) : t(this.iterationOrder, _, n, r, i, a) : b(s) ? t(this.iterationOrder, v, n, r, i, a) : t(this.iterationOrder, y, n, r, i, a);
	}
}, Z = class extends Y {
	snapshot;
	constructor(e, t) {
		let n = new F(e), r = new B(n, t);
		super(r, n), this.snapshot = e;
	}
	nodePosition(e) {
		this.createIterationOrder();
		let t = this.snapshot.createNode(), n = 0;
		if (!this.iterationOrder) throw Error("Iteration order not defined");
		for (; n < this.iterationOrder.length && (t.nodeIndex = this.iterationOrder[n], t.id() !== e); n++);
		if (n === this.iterationOrder.length) return -1;
		let r = this.iterationOrder[n], i = 0, a = this.currentComparator, o = this.buildCompareFunction(a);
		for (let e = 0; e < this.iterationOrder.length; e++) o(this.iterationOrder[e], r) < 0 && ++i;
		return i;
	}
	buildCompareFunction(e) {
		let t = this.snapshot.createNode(), n = this.snapshot.createNode(), r = t[e.fieldName1], i = t[e.fieldName2], a = e.ascending1 ? 1 : -1, o = e.ascending2 ? 1 : -1;
		function s(e, r) {
			let i = e.call(t), a = e.call(n);
			return i < a ? -r : i > a ? r : 0;
		}
		function c(e, c) {
			t.nodeIndex = e, n.nodeIndex = c;
			let l = s(r, a);
			return l === 0 && (l = s(i, o)), l || e - c;
		}
		return c;
	}
	sort(e, n, r, i, a) {
		if (!this.iterationOrder) throw Error("Iteration order not defined");
		t(this.iterationOrder, this.buildCompareFunction(e), n, r, i, a);
	}
}, Q = class extends J {
	nodeFlags;
	flags;
	#e;
	constructor(e, t) {
		super(e, t), this.nodeFlags = {
			canBeQueried: 1,
			detachedDOMTreeNode: 2,
			pageObject: 4
		};
	}
	createNode(e) {
		return new $(this, e === void 0 ? -1 : e);
	}
	createEdge(e) {
		return new fe(this, e);
	}
	createRetainingEdge(e) {
		return new pe(this, e);
	}
	containmentEdgesFilter() {
		return (e) => !e.isInvisible();
	}
	retainingEdgesFilter() {
		let e = this.containmentEdgesFilter();
		function t(t) {
			return e(t) && !t.node().isRoot() && !t.isWeak();
		}
		return t;
	}
	calculateFlags() {
		this.flags = new Uint8Array(this.nodeCount), this.markDetachedDOMTreeNodes(), this.markQueriableHeapObjects(), this.markPageOwnedNodes();
	}
	#t() {
		for (let e = this.rootNode().edges(); e.hasNext(); e.next()) if (this.isUserRoot(e.edge.node())) return !0;
		return !1;
	}
	calculateShallowSizes() {
		if (!this.#t()) return;
		let { nodeCount: e, nodes: t, nodeFieldCount: n, nodeSelfSizeOffset: r } = this, i = 4294967295, a = 4294967294;
		if (e >= a) throw Error("Too many nodes for calculateShallowSizes");
		let o = new Uint32Array(e), s = [], c = this.createNode(0);
		for (let t = 0; t < e; ++t) c.isHidden() || c.isArray() || c.isNative() && c.rawName() === "system / ExternalStringData" ? o[t] = i : (o[t] = t, s.push(t)), c.nodeIndex = c.nextNodeIndex();
		for (; s.length !== 0;) {
			let e = s.pop(), t = o[e];
			c.nodeIndex = e * n;
			for (let e = c.edges(); e.hasNext(); e.next()) {
				let r = e.edge;
				if (r.isWeak()) continue;
				let c = r.nodeIndex() / n;
				switch (o[c]) {
					case i:
						o[c] = t, s.push(c);
						break;
					case c:
					case t:
					case a: break;
					default: o[c] = a, s.push(c);
				}
			}
		}
		for (let s = 0; s < e; ++s) {
			let e = o[s];
			switch (e) {
				case i:
				case a:
				case s: break;
				default: {
					let i = s * n, a = e * n;
					if (c.nodeIndex = a, c.isSynthetic() || c.isRoot()) break;
					let o = t.getValue(i + r);
					t.setValue(i + r, 0), t.setValue(a + r, t.getValue(a + r) + o);
					break;
				}
			}
		}
	}
	calculateDistances(e) {
		let t = /* @__PURE__ */ new Set(), n = this;
		function r(e, r) {
			if (e.isHidden() && r.name() === "sloppy_function_map" && e.rawName() === "system / NativeContext") return !1;
			if (e.isArray() && e.rawName() === "(map descriptors)") {
				let e = parseInt(r.name(), 10);
				return e < 2 || e % 3 != 1;
			}
			if (r.isInternal()) {
				let e = n.tryParseWeakMapEdgeName(r.nameIndex());
				if (e && !t.delete(e.duplicatedPart)) return t.add(e.duplicatedPart), !1;
			}
			return !0;
		}
		super.calculateDistances(e, r);
	}
	isUserRoot(e) {
		return e.isUserRoot() || e.isDocumentDOMTreesRoot();
	}
	userObjectsMapAndFlag() {
		return {
			map: this.flags,
			flag: this.nodeFlags.pageObject
		};
	}
	flagsOfNode(e) {
		return this.flags[e.nodeIndex / this.nodeFieldCount];
	}
	markDetachedDOMTreeNodes() {
		let e = this.nodes, t = e.length, n = this.nodeFieldCount, r = this.nodeNativeType, i = this.nodeTypeOffset, a = this.nodeFlags.detachedDOMTreeNode, o = this.rootNode();
		for (let s = 0, c = 0; s < t; s += n, c++) e.getValue(s + i) === r && (o.nodeIndex = s, o.name().startsWith("Detached ") && (this.flags[c] |= a));
	}
	markQueriableHeapObjects() {
		let e = this.nodeFlags.canBeQueried, t = this.edgeHiddenType, n = this.edgeInternalType, r = this.edgeInvisibleType, i = this.edgeWeakType, a = this.edgeToNodeOffset, o = this.edgeTypeOffset, s = this.edgeFieldsCount, c = this.containmentEdges, l = this.nodeFieldCount, u = this.firstEdgeIndexes, d = this.flags, f = [];
		for (let e = this.rootNode().edges(); e.hasNext(); e.next()) e.edge.node().isUserRoot() && f.push(e.edge.node().nodeIndex / l);
		for (; f.length;) {
			let p = f.pop();
			if (d[p] & e) continue;
			d[p] |= e;
			let m = u[p], h = u[p + 1];
			for (let u = m; u < h; u += s) {
				let s = c.getValue(u + a) / l;
				if (d[s] & e) continue;
				let p = c.getValue(u + o);
				p !== t && p !== r && p !== n && p !== i && f.push(s);
			}
		}
	}
	markPageOwnedNodes() {
		let e = this.edgeShortcutType, t = this.edgeElementType, n = this.edgeToNodeOffset, r = this.edgeTypeOffset, i = this.edgeFieldsCount, a = this.edgeWeakType, o = this.firstEdgeIndexes, s = this.containmentEdges, c = this.nodeFieldCount, l = this.nodeCount, u = this.flags, d = this.nodeFlags.pageObject, f = new Uint32Array(l), p = 0, m = this.rootNodeIndexInternal / c, h = this.rootNode();
		for (let a = o[m], l = o[m + 1]; a < l; a += i) {
			let i = s.getValue(a + r), o = s.getValue(a + n);
			if (i === t) {
				if (h.nodeIndex = o, !h.isDocumentDOMTreesRoot()) continue;
			} else if (i !== e) continue;
			let l = o / c;
			f[p++] = l, u[l] |= d;
		}
		for (; p;) {
			let e = f[--p], t = o[e], l = o[e + 1];
			for (let e = t; e < l; e += i) {
				let t = s.getValue(e + n) / c;
				u[t] & d || s.getValue(e + r) !== a && (f[p++] = t, u[t] |= d);
			}
		}
	}
	calculateStatistics() {
		let e = this.nodeFieldCount, t = this.nodes, n = t.length, r = this.nodeTypeOffset, i = this.nodeSelfSizeOffset, a = this.nodeNativeType, o = this.nodeCodeType, s = this.nodeConsStringType, c = this.nodeSlicedStringType, l = this.nodeHiddenType, u = this.nodeStringType, d = this.profile.snapshot.extra_native_bytes ?? 0, f = 0, p = 0, m = 0, h = 0, g = 0, _ = this.rootNode();
		for (let v = 0; v < n; v += e) {
			let e = t.getValue(v + i), n = t.getValue(v + r);
			if (n === l) {
				g += e;
				continue;
			}
			_.nodeIndex = v, n === a ? (d += e, _.rawName() === "system / JSArrayBufferData" && (f += e)) : n === o ? p += e : n === s || n === c || n === u ? m += e : _.rawName() === "Array" && (h += this.calculateArraySize(_));
		}
		this.#e = {
			total: this.totalSize,
			native: {
				total: d,
				typedArrays: f
			},
			v8heap: {
				total: this.totalSize - d,
				code: p,
				jsArrays: h,
				strings: m,
				system: g
			}
		};
	}
	calculateArraySize(e) {
		let t = e.selfSize(), n = e.edgeIndexesStart(), r = e.edgeIndexesEnd(), i = this.containmentEdges, a = this.strings, o = this.edgeToNodeOffset, s = this.edgeTypeOffset, c = this.edgeNameOffset, l = this.edgeFieldsCount, u = this.edgeInternalType;
		for (let d = n; d < r; d += l) if (i.getValue(d + s) === u && a[i.getValue(d + c)] === "elements") {
			e.nodeIndex = i.getValue(d + o), e.retainersCount() === 1 && (t += e.selfSize());
			break;
		}
		return t;
	}
	getStatistics() {
		return this.#e;
	}
};
async function de(e) {
	let t = new Q(e, new H()), n = new MessageChannel();
	return new G(n.port2), await t.initialize(n.port1), t;
}
var $ = class e extends R {
	canBeQueried() {
		let e = this.snapshot;
		return !!(e.flagsOfNode(this) & e.nodeFlags.canBeQueried);
	}
	name() {
		let e = this.snapshot;
		return this.rawType() === e.nodeConsStringType ? this.consStringName() : this.rawType() === e.nodeObjectType && this.rawName() === "Object" ? this.#e() : this.rawName();
	}
	consStringName() {
		let e = this.snapshot, t = e.nodeConsStringType, n = e.edgeInternalType, r = e.edgeFieldsCount, i = e.edgeToNodeOffset, a = e.edgeTypeOffset, o = e.edgeNameOffset, s = e.strings, c = e.containmentEdges, l = e.firstEdgeIndexes, u = e.nodeFieldCount, d = e.nodeTypeOffset, f = e.nodeNameOffset, p = e.nodes, m = [];
		m.push(this.nodeIndex);
		let h = "";
		for (; m.length && h.length < 1024;) {
			let e = m.pop();
			if (p.getValue(e + d) !== t) {
				h += s[p.getValue(e + f)];
				continue;
			}
			let g = e / u, _ = l[g], v = l[g + 1], y = 0, b = 0;
			for (let e = _; e < v && (!y || !b); e += r) if (c.getValue(e + a) === n) {
				let t = s[c.getValue(e + o)];
				t === "first" ? y = c.getValue(e + i) : t === "second" && (b = c.getValue(e + i));
			}
			m.push(b), m.push(y);
		}
		return h;
	}
	#e() {
		let t = this.snapshot, { edgeFieldsCount: n, edgePropertyType: r } = t, i = t.createEdge(0), a = "{", o = "}", s = this.edgeIndexesStart(), c = this.edgeIndexesEnd() - n, l = !1;
		for (; s <= c;) {
			if (i.edgeIndex = l ? c : s, i.rawType() !== r || i.name() === "__proto__") {
				l ? c -= n : s += n;
				continue;
			}
			let t = e.formatPropertyName(i.name());
			if (a.length > 1 && a.length + o.length + t.length > 100) break;
			l ? (c -= n, o.length > 1 && (o = ", " + o), o = t + o) : (s += n, a.length > 1 && (a += ", "), a += t), l = !l;
		}
		return s <= c && (a += ", …"), o.length > 1 && (a += ", "), a + o;
	}
	static formatPropertyName(e) {
		return /[,'"{}]/.test(e) && (e = JSON.stringify({ [e]: 0 }), e = e.substring(1, e.length - 3)), e;
	}
	id() {
		let e = this.snapshot;
		return e.nodes.getValue(this.nodeIndex + e.nodeIdOffset);
	}
	isHidden() {
		return this.rawType() === this.snapshot.nodeHiddenType;
	}
	isArray() {
		return this.rawType() === this.snapshot.nodeArrayType;
	}
	isSynthetic() {
		return this.rawType() === this.snapshot.nodeSyntheticType;
	}
	isNative() {
		return this.rawType() === this.snapshot.nodeNativeType;
	}
	isUserRoot() {
		return !this.isSynthetic();
	}
	isDocumentDOMTreesRoot() {
		return this.isSynthetic() && this.rawName() === "(Document DOM trees)";
	}
	serialize() {
		let e = super.serialize(), t = this.snapshot, n = t.flagsOfNode(this);
		return n & t.nodeFlags.canBeQueried && (e.canBeQueried = !0), n & t.nodeFlags.detachedDOMTreeNode && (e.detachedDOMTreeNode = !0), e;
	}
}, fe = class e extends P {
	clone() {
		let t = this.snapshot;
		return new e(t, this.edgeIndex);
	}
	hasStringName() {
		return this.isShortcut() ? isNaN(parseInt(this.#t(), 10)) : this.#e();
	}
	isElement() {
		return this.rawType() === this.snapshot.edgeElementType;
	}
	isHidden() {
		return this.rawType() === this.snapshot.edgeHiddenType;
	}
	isWeak() {
		return this.rawType() === this.snapshot.edgeWeakType;
	}
	isInternal() {
		return this.rawType() === this.snapshot.edgeInternalType;
	}
	isInvisible() {
		return this.rawType() === this.snapshot.edgeInvisibleType;
	}
	isShortcut() {
		return this.rawType() === this.snapshot.edgeShortcutType;
	}
	name() {
		let e = this.#t();
		if (!this.isShortcut()) return String(e);
		let t = parseInt(e, 10);
		return String(isNaN(t) ? e : t);
	}
	toString() {
		let e = this.name();
		switch (this.type()) {
			case "context": return "->" + e;
			case "element": return "[" + e + "]";
			case "weak": return "[[" + e + "]]";
			case "property": return e.indexOf(" ") === -1 ? "." + e : "[\"" + e + "\"]";
			case "shortcut": return typeof e == "string" ? e.indexOf(" ") === -1 ? "." + e : "[\"" + e + "\"]" : "[" + e + "]";
			case "internal":
			case "hidden":
			case "invisible": return "{" + e + "}";
		}
		return "?" + e + "?";
	}
	#e() {
		let e = this.rawType(), t = this.snapshot;
		return e !== t.edgeElementType && e !== t.edgeHiddenType;
	}
	#t() {
		return this.#e() ? this.snapshot.strings[this.nameOrIndex()] : this.nameOrIndex();
	}
	nameOrIndex() {
		return this.edges.getValue(this.edgeIndex + this.snapshot.edgeNameOffset);
	}
	rawType() {
		return this.edges.getValue(this.edgeIndex + this.snapshot.edgeTypeOffset);
	}
	nameIndex() {
		if (!this.#e()) throw Error("Edge does not have string name");
		return this.nameOrIndex();
	}
}, pe = class e extends ae {
	clone() {
		let t = this.snapshot;
		return new e(t, this.retainerIndex());
	}
	isHidden() {
		return this.edge().isHidden();
	}
	isInvisible() {
		return this.edge().isInvisible();
	}
	isShortcut() {
		return this.edge().isShortcut();
	}
	isWeak() {
		return this.edge().isWeak();
	}
}, me = /* @__PURE__ */ e({ HeapSnapshotLoader: () => he }), he = class {
	#e;
	#t;
	#n;
	#r;
	#i;
	#a;
	#o;
	#s = "";
	parsingComplete;
	constructor(e) {
		this.#c(), this.#e = new H(e), this.#t = [], this.#n = null, this.#r = !1, this.parsingComplete = this.#m();
	}
	dispose() {
		this.#c();
	}
	#c() {
		this.#s = "", this.#i = void 0;
	}
	close() {
		this.#r = !0, this.#n && this.#n("");
	}
	async buildSnapshot(e) {
		await this.parsingComplete, this.#i = this.#i || {}, this.#e.updateStatus("Processing snapshot…");
		let t = new Q(this.#i, this.#e);
		return await t.initialize(e), this.#c(), t;
	}
	#l() {
		let e = 0, t = this.#s.length;
		for (;;) {
			for (; e < t;) {
				let t = this.#s.charCodeAt(e);
				if (48 <= t && t <= 57) break;
				if (t === 93) return this.#s = this.#s.slice(e + 1), !1;
				++e;
			}
			if (e === t) return this.#s = "", !0;
			let n = 0, r = e;
			for (; e < t;) {
				let t = this.#s.charCodeAt(e);
				if (48 > t || t > 57) break;
				n *= 10, n += t - 48, ++e;
			}
			if (e === t) return this.#s = this.#s.slice(r), !0;
			if (!this.#a) throw Error("Array not instantiated");
			this.#a.setValue(this.#o++, n);
		}
	}
	#u() {
		this.#e.updateStatus("Parsing strings…");
		let e = this.#s.lastIndexOf("]");
		if (e === -1) throw Error("Incomplete JSON");
		if (this.#s = this.#s.slice(0, e + 1), !this.#i) throw Error("No snapshot in parseStringsArray");
		this.#i.strings = JSON.parse(this.#s);
	}
	write(e) {
		this.#t.push(e), this.#n &&= (this.#n(this.#t.shift()), null);
	}
	#d() {
		if (this.#t.length > 0) return Promise.resolve(this.#t.shift());
		let { promise: e, resolve: t } = Promise.withResolvers();
		return this.#n = t, e;
	}
	async #f(e, t) {
		for (;;) {
			let n = this.#s.indexOf(e, t || 0);
			if (n !== -1) return n;
			t = this.#s.length - e.length + 1, this.#s += await this.#d();
		}
	}
	async #p(e, t, n) {
		let r = await this.#f(e), i = await this.#f("[", r);
		for (this.#s = this.#s.slice(i + 1), this.#a = n === void 0 ? w() : T(n), this.#o = 0; this.#l();) n ? this.#e.updateProgress(t, this.#o, this.#a.length) : this.#e.updateStatus(t), this.#s += await this.#d();
		let a = this.#a;
		return this.#a = null, a;
	}
	async #m() {
		let e = await this.#f("\"snapshot\"");
		if (e === -1) throw Error("Snapshot token not found");
		this.#e.updateStatus("Loading snapshot info…");
		let t = this.#s.slice(e + 10 + 1), n = !1, r = new s((e) => {
			this.#s = r.remainder(), n = !0, this.#i = this.#i || {}, this.#i.snapshot = JSON.parse(e);
		});
		for (r.write(t); !n;) r.write(await this.#d());
		this.#i = this.#i || {};
		let i = await this.#p("\"nodes\"", "Loading nodes… {PH1}%", this.#i.snapshot.meta.node_fields.length * this.#i.snapshot.node_count);
		this.#i.nodes = i;
		let a = await this.#p("\"edges\"", "Loading edges… {PH1}%", this.#i.snapshot.meta.edge_fields.length * this.#i.snapshot.edge_count);
		if (this.#i.edges = a, this.#i.snapshot.trace_function_count) {
			let e = await this.#p("\"trace_function_infos\"", "Loading allocation traces… {PH1}%", this.#i.snapshot.meta.trace_function_info_fields.length * this.#i.snapshot.trace_function_count);
			this.#i.trace_function_infos = e.asUint32ArrayOrFail();
			let t = await this.#f(":"), n = await this.#f("\"", t), r = this.#s.indexOf("["), i = this.#s.lastIndexOf("]", n);
			this.#i.trace_tree = JSON.parse(this.#s.substring(r, i + 1)), this.#s = this.#s.slice(i + 1);
		}
		if (this.#i.snapshot.meta.sample_fields) {
			let e = await this.#p("\"samples\"", "Loading samples…");
			this.#i.samples = e.asArrayOrFail();
		}
		if (this.#i.snapshot.meta.location_fields) {
			let e = await this.#p("\"locations\"", "Loading locations…");
			this.#i.locations = e.asArrayOrFail();
		} else this.#i.locations = [];
		this.#e.updateStatus("Loading strings…");
		let o = await this.#f("\"strings\""), c = await this.#f("[", o);
		for (this.#s = this.#s.slice(c); this.#t.length > 0 || !this.#r;) this.#s += await this.#d();
		this.#u();
	}
}, ge = new class {
	#e = [];
	#t;
	constructor(e) {
		this.#t = e;
	}
	sendEvent(e, t) {
		this.#t({
			eventName: e,
			data: t
		});
	}
	async dispatchMessage({ data: e, ports: t }) {
		let n = {
			callId: e.callId,
			result: null
		};
		try {
			switch (e.disposition) {
				case "createLoader":
					this.#e[e.objectId] = new he(this);
					break;
				case "dispose":
					delete this.#e[e.objectId];
					break;
				case "getter":
					n.result = this.#e[e.objectId][e.methodName];
					break;
				case "factory": {
					let r = this.#e[e.objectId], i = e.methodArguments.slice();
					i.push(...t);
					let a = await r[e.methodName].apply(r, i);
					a && (this.#e[e.newObjectId] = a), n.result = !!a;
					break;
				}
				case "method": {
					let t = this.#e[e.objectId];
					n.result = t[e.methodName].apply(t, e.methodArguments);
					break;
				}
				case "evaluateForTest":
					try {
						globalThis.HeapSnapshotWorker = {
							AllocationProfile: A,
							HeapSnapshot: ne,
							HeapSnapshotLoader: me
						}, globalThis.HeapSnapshotModel = b, n.result = await self.eval(e.source);
					} catch (e) {
						n.result = e.toString();
					}
					break;
				case "setupForSecondaryInit": this.#e[e.objectId] = new G(t[0]);
			}
		} catch (t) {
			n.error = t.toString(), n.errorCallStack = t.stack, e.methodName && (n.errorMethodName = e.methodName);
		}
		this.#t(n);
	}
}(a.workerScope.postMessage.bind(a.workerScope));
a.workerScope.onmessage = ge.dispatchMessage.bind(ge), a.workerScope.postMessage("workerReady");
//#endregion
