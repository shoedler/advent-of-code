import * as fs from 'fs';

type SourceNode = { 
  node: Node,
}

type Node = {
  value: number,
  origin: SourceNode,
}

const getNodes = () => {
  const nodes: Node[] = [];
  const origins: readonly SourceNode[] = fs.readFileSync('./input.txt', 'utf-8').split('\r\n').map(n => { 
    const num = Number(n);
    const node: Node = { value: num, origin: null };
    const origin: SourceNode = { node };

    node.origin = origin;
    nodes.push(node);
    return origin
  });
  
  return { origins, nodes }
}

const findGrove = (origins: readonly SourceNode[], nodes: Node[], iters: number) => {
  for (let i = 0; i < iters; i++) {
    origins.forEach(origin => {  
      const index = nodes.indexOf(origin.node);
      let targetIndex = index + origin.node.value;
    
      targetIndex = targetIndex >= nodes.length ? targetIndex % (nodes.length - 1)
        : targetIndex < 0 ? (targetIndex % (nodes.length - 1)) + nodes.length - 1
        : targetIndex;
      
      let node = nodes.splice(index, 1)[0];
      nodes.splice(targetIndex, 0, node);
    })
  }

  const zeroIndex = nodes.findIndex(node => node.value === 0);
  const grove = [
    (((1000 % nodes.length) + zeroIndex) % nodes.length),
    (((2000 % nodes.length) + zeroIndex) % nodes.length),
    (((3000 % nodes.length) + zeroIndex) % nodes.length),
  ];

  return grove.map(index => nodes[index].value).reduce((a,b) => a+b);
}

// Setup: i7-1065H, 16GB RAM node v17.8.0
(() => {
  const t = Date.now();
  const { origins, nodes } = getNodes();
  
  const grove = findGrove(origins, nodes, 1);
  
  const duration = Date.now() - t;
  console.log("Part One", grove, `took ${duration}ms`); // 11123 took 38ms

})();

(() => {
  const t = Date.now();
  const { origins, nodes } = getNodes();
  
  nodes.map(n => n.value *= 811589153)
  const grove = findGrove(origins, nodes, 10);

  const duration = Date.now() - t;
  console.log("Part One", grove, `took ${duration}ms`); // 4248669215955 took 283ms
})();