import type { Edge } from "@xyflow/react";

export default function Arcos() {
  const initialEdges: Edge[] = [
    {
      id: "e2-4",
      source: "2",
      target: "4",
      style: { stroke: "#e20e0e", strokeDasharray: "5,5" },
    },
    {
      id: "e3-5",
      source: "3",
      target: "5",
      style: { stroke: "#cf1c1c" },
    },
  ];
  return initialEdges;
}
