
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { TreeData } from '../types';

interface FamilyTreeProps {
  data: TreeData;
}

const FamilyTree: React.FC<FamilyTreeProps> = ({ data }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data) return;

    const width = 1000;
    const height = 600;
    const margin = { top: 40, right: 120, bottom: 40, left: 120 };

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const g = svg
      .attr("viewBox", [-margin.left, -margin.top, width, height])
      .append("g");

    const root = d3.hierarchy(data);
    const treeLayout = d3.tree<TreeData>().size([height - margin.top - margin.bottom, width - margin.left - margin.right]);

    treeLayout(root);

    // Links
    g.append("g")
      .attr("fill", "none")
      .attr("stroke", "#cbd5e1")
      .attr("stroke-width", 1.5)
      .selectAll("path")
      .data(root.links())
      .join("path")
      .attr("class", "tree-link")
      .attr("d", d3.linkHorizontal<d3.HierarchyLink<TreeData>, d3.HierarchyPointNode<TreeData>>()
        .x(d => d.y)
        .y(d => d.x));

    // Nodes
    const node = g.append("g")
      .selectAll("g")
      .data(root.descendants())
      .join("g")
      .attr("class", "tree-node")
      .attr("transform", d => `translate(${d.y},${d.x})`);

    node.append("circle")
      .attr("fill", d => d.children ? "#4f46e5" : "#10b981")
      .attr("r", 6);

    const label = node.append("text")
      .attr("dy", "0.31em")
      .attr("x", d => d.children ? -12 : 12)
      .attr("text-anchor", d => d.children ? "end" : "start")
      .attr("class", "text-sm font-semibold fill-slate-800")
      .text(d => d.data.name);

    node.append("text")
      .attr("dy", "1.5em")
      .attr("x", d => d.children ? -12 : 12)
      .attr("text-anchor", d => d.children ? "end" : "start")
      .attr("class", "text-[10px] fill-slate-500 italic")
      .text(d => {
        const years = [d.data.birthYear, d.data.deathYear].filter(Boolean).join(" - ");
        return years || d.data.role || "";
      });

  }, [data]);

  return (
    <div className="w-full h-[600px] overflow-auto bg-white rounded-2xl shadow-inner border border-slate-200">
      <svg ref={svgRef} className="w-full h-full min-w-[800px]" />
    </div>
  );
};

export default FamilyTree;
