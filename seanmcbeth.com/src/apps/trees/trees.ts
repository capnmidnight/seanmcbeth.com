// Say we have some data about relationships...
const myData = [
    { name: "A", parent: null },
    { name: "B", parent: "A" },
    { name: "C", parent: "A" },
    { name: "D", parent: "B" }
];

// "We have some data about relationships."

// To build a tree, we need a very simple data structure to hold
// the values with their connections. You sometimes don't even
// need to create this data structure yourself, as there are many
// cases where it's provided to you, e.g. DOMs for HTML/XML/SVG,
// or object-oriented file system objects like DirectoryInfo in .NET.
// But let's assume we have to do it manually.
class TreeNode {

    parent: TreeNode = null;
    children = new Array<TreeNode>();

    constructor(public value: string) { }

    connect(node: TreeNode) {
        node.parent = this;
        this.children.push(node);
    }
}

// We next need to prep a space for resolving the relationships,
// so we start by creating unconnected Nodes for every value we
// know about. You could try to resolv e the connections at the
// same time as creating the nodes, but that only works if you're
// given the data in an ordered way that makes sure deeper values
// come after shallower ones. Let's assume the worst case scenario
// of having no idea what order they're coming in, because merging
// partial trees after the fact is much more effort anyway.
const lookup = new Map<string, TreeNode>();
for (const value of myData) {
    lookup.set(value.name, new TreeNode(value.name));
}

// Now that we have the space in which to work, we can resolve
// the connections.
for (const value of myData) {
    const node = lookup.get(value.name);

    const parent = lookup.get(value.parent);

    // Not every node has a parent! 
    // Sometimes you can handle this by creating a vestigial
    // root node that has no value, but I've found that can
    // overcomplicate processing of values. It's better to
    // just assuming you're dealing with multiple trees.
    if (parent) {
        parent.connect(node);
    }
}

// Once we've done that work, we can now find all the trees that
// our data represents.
const roots = Array.from(lookup.values()).filter(node => node.parent === null);

// If we know for a fact that we are always dealing with one,
// complete tree, this is the best place to handle that.
const root = roots[0];

// Now that we have the tree, the two most important
// operations are the breadth-first and the depth-first traversal.
// There's actually very little difference between the two,
// coming down wether we read from the head or a tail of a growing
// temp list used to keep track of our place in the tree.
// We don't need recursion to do this. Indeed, recursion is
// the wrong way to do it in most programming languages you'll
// actually encounter in the real world, do to limitations of
// the function call stack and the programming language's
// inability to do tail-call elission, but that's a digression.
// The iterative approach is both cleaner and faster.

function *breadthFirstTreeTraversal(root: TreeNode): IterableIterator<TreeNode> {
    // Start at the root.
    const toVisit = [root];
    
    // Keep going while we still have work to do.
    while (toVisit.length > 0) {
        // Pay attention to this line:
        const here = toVisit.shift(); // <-- pay attention here

        // Extend the work we have to do
        if (here.children.length > 0) {
            toVisit.push(...here.children);
        }

        // Give the value back to some place we can use it.
        yield here;
    }
}

function *depthFirstTreeTraversal(root: TreeNode): IterableIterator<TreeNode> {
    const toVisit = [root];
    while(toVisit.length > 0) {
        // This is it! This is the difference between breadth-
        // and depth-first traversal.
        const here = toVisit.pop();

        if (here.children.length > 0) {
            toVisit.push(...here.children);
        }

        yield here;
    }
}

// Now we can iterate over our tree as such:
for(const value of breadthFirstTreeTraversal(root)){
    console.log(value);
    // Will print:
    //   A
    //   B
    //   C
    //   D
}

for(const value of depthFirstTreeTraversal(root)){
    console.log(value);
    // Will print:
    //   A
    //   B
    //   D
    //   C
}

// Which do you use? It's up to you. It on your data
// and the processing you have to do on it.
// If your processing must process the entire tree,
// then there is no difference. If you are searching
// the tree for a single value, then theoretically on
// average they are the same, but in reality your data
// and the searches you want to do of them might
// favor shallow searches over deep ones, or vice versa.

type mode = "bfs" | "dfs";

function search<T>(mode: mode, root: T, getChildren: (node: T) => Iterable<T>, doWork: (node: T) => void): void {
    const toVisit = [root];
    while(toVisit.length > 0){
        const here = mode === "bfs"
            ? toVisit.shift()
            : toVisit.pop();

        const children = getChildren(here);
        toVisit.push(...children);

        doWork(here);
    }
}

search<Element>("bfs", document.documentElement, e => e.children, console.log);