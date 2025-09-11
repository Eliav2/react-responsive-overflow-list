# Example Usage

## Basic Example

```tsx
import React from "react";
import { OverflowList } from "react-responsive-overflow-list";

const items = ["Apple", "Banana", "Cherry", "Date", "Elderberry", "Fig", "Grape"];

export function BasicExample() {
	return (
		<div style={{ width: "300px", border: "1px solid #ccc", padding: "8px" }}>
			<OverflowList
				items={items}
				renderItem={(item, index) => (
					<span
						key={index}
						style={{
							padding: "4px 8px",
							backgroundColor: "#f0f0f0",
							borderRadius: "4px",
							fontSize: "14px",
						}}
					>
						{item}
					</span>
				)}
				maxRows={1}
				gap="2"
			/>
		</div>
	);
}
```

## Toolbar Example

```tsx
import React from "react";
import { OverflowList } from "react-responsive-overflow-list";

const buttons = [
	{ id: "new", label: "New", icon: "📄" },
	{ id: "open", label: "Open", icon: "📂" },
	{ id: "save", label: "Save", icon: "💾" },
	{ id: "print", label: "Print", icon: "🖨️" },
	{ id: "export", label: "Export", icon: "📤" },
	{ id: "settings", label: "Settings", icon: "⚙️" },
];

export function ToolbarExample() {
	return (
		<div
			style={{
				width: "100%",
				maxWidth: "400px",
				border: "1px solid #ddd",
				borderRadius: "8px",
				padding: "8px",
				backgroundColor: "#fafafa",
			}}
		>
			<OverflowList
				items={buttons}
				renderItem={(button) => (
					<button
						key={button.id}
						style={{
							display: "flex",
							alignItems: "center",
							gap: "4px",
							padding: "6px 12px",
							border: "1px solid #ccc",
							borderRadius: "4px",
							backgroundColor: "white",
							cursor: "pointer",
							fontSize: "14px",
						}}
						onClick={() => console.log(`Clicked: ${button.id}`)}
					>
						<span>{button.icon}</span>
						<span>{button.label}</span>
					</button>
				)}
				maxRows={1}
				gap="2"
			/>
		</div>
	);
}
```

## Custom Overflow Example

```tsx
import React, { useState } from "react";
import { OverflowList } from "react-responsive-overflow-list";

const tags = ["React", "TypeScript", "CSS", "HTML", "JavaScript", "Node.js", "Express", "MongoDB"];

function CustomOverflowMenu({ items }: { items: string[] }) {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<div style={{ position: "relative" }}>
			<button
				onClick={() => setIsOpen(!isOpen)}
				style={{
					padding: "4px 8px",
					backgroundColor: "#e3f2fd",
					border: "1px solid #2196f3",
					borderRadius: "4px",
					color: "#1976d2",
					cursor: "pointer",
				}}
			>
				+{items.length} more
			</button>
			{isOpen && (
				<div
					style={{
						position: "absolute",
						top: "100%",
						left: 0,
						zIndex: 1000,
						backgroundColor: "white",
						border: "1px solid #ccc",
						borderRadius: "4px",
						boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
						padding: "8px",
						minWidth: "120px",
					}}
				>
					{items.map((item, index) => (
						<div
							key={index}
							style={{
								padding: "4px 8px",
								cursor: "pointer",
								borderRadius: "2px",
							}}
						>
							#{item}
						</div>
					))}
				</div>
			)}
		</div>
	);
}

export function CustomOverflowExample() {
	return (
		<div style={{ width: "300px", padding: "16px" }}>
			<h3>Tags:</h3>
			<OverflowList
				items={tags}
				renderItem={(tag) => (
					<span
						style={{
							padding: "2px 6px",
							backgroundColor: "#f5f5f5",
							border: "1px solid #ddd",
							borderRadius: "12px",
							fontSize: "12px",
							color: "#666",
						}}
					>
						#{tag}
					</span>
				)}
				renderOverflow={(items) => <CustomOverflowMenu items={items} />}
				maxRows={2}
				gap="1"
			/>
		</div>
	);
}
```

## Responsive Design Example

```tsx
import React from "react";
import { OverflowList } from "react-responsive-overflow-list";

const menuItems = ["Home", "About", "Services", "Portfolio", "Blog", "Contact", "Careers"];

export function ResponsiveNavExample() {
	return (
		<nav
			style={{
				width: "100%",
				maxWidth: "600px",
				padding: "12px 16px",
				backgroundColor: "#2c3e50",
				borderRadius: "8px",
			}}
		>
			<OverflowList
				items={menuItems}
				renderItem={(item) => (
					<a
						href={`#${item.toLowerCase()}`}
						style={{
							color: "white",
							textDecoration: "none",
							padding: "8px 16px",
							borderRadius: "4px",
							fontSize: "14px",
							fontWeight: "500",
							transition: "background-color 0.2s",
						}}
						onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#34495e")}
						onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
					>
						{item}
					</a>
				)}
				renderOverflowProps={{
					triggerProps: {
						style: {
							backgroundColor: "#34495e",
							color: "white",
							border: "none",
						},
					},
				}}
				maxRows={1}
				gap="1"
			/>
		</nav>
	);
}
```
