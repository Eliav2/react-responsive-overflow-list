import React, { useState, useRef, useEffect } from "react";
import classNames from "classnames";
import styles from "./OverflowList.module.css";

/**
 * Simple default overflow menu component that displays hidden items in a basic dropdown
 */
export interface DefaultOverflowMenuProps<T> {
	items: T[];
	visibleCount: number;
	renderItem: (item: T, index: number) => React.ReactNode;
	renderText?: (count: number) => React.ReactNode;
	triggerProps?: React.ButtonHTMLAttributes<HTMLButtonElement>;
}

export const DefaultOverflowMenu = React.forwardRef(function DefaultOverflowMenu<T>(
	props: DefaultOverflowMenuProps<T>,
	ref: React.ForwardedRef<HTMLButtonElement>,
) {
	const { items, renderItem, renderText = (count) => `+${count} more`, triggerProps } = props;
	const [isOpen, setIsOpen] = useState(false);
	const containerRef = useRef<HTMLDivElement>(null);

	// Close dropdown when clicking outside
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
				setIsOpen(false);
			}
		};

		if (isOpen) {
			document.addEventListener("mousedown", handleClickOutside);
			return () => document.removeEventListener("mousedown", handleClickOutside);
		}
	}, [isOpen]);

	const handleToggle = (e: React.MouseEvent) => {
		e.stopPropagation();
		setIsOpen(!isOpen);
		triggerProps?.onClick?.(e);
	};

	return (
		<div ref={containerRef} style={{ position: "relative", display: "inline-block" }}>
			<button
				ref={ref}
				{...triggerProps}
				className={classNames(styles.defaultOverflowButton, triggerProps?.className)}
				onClick={handleToggle}
				style={{
					padding: "4px 8px",
					backgroundColor: "transparent",
					border: "1px solid #ccc",
					borderRadius: "4px",
					cursor: "pointer",
					fontSize: "12px",
					...triggerProps?.style,
				}}
			>
				{renderText(items.length)}
			</button>

			{isOpen && (
				<div
					style={{
						position: "absolute",
						top: "100%",
						left: "0",
						zIndex: 1000,
						minWidth: "120px",
						maxWidth: "300px",
						maxHeight: "200px",
						overflow: "auto",
						backgroundColor: "white",
						border: "1px solid #ccc",
						borderRadius: "4px",
						boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
						padding: "4px",
						marginTop: "2px",
					}}
					onClick={(e) => e.stopPropagation()}
				>
					<div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
						{items.map((item, index) => (
							<div
								key={index}
								style={{
									padding: "4px 8px",
									borderRadius: "2px",
									cursor: "pointer",
								}}
								onMouseEnter={(e) => {
									(e.target as HTMLElement).style.backgroundColor = "#f5f5f5";
								}}
								onMouseLeave={(e) => {
									(e.target as HTMLElement).style.backgroundColor = "transparent";
								}}
							>
								{renderItem(item, index)}
							</div>
						))}
					</div>
				</div>
			)}
		</div>
	);
}) as <T>(props: DefaultOverflowMenuProps<T> & { ref?: React.Ref<HTMLButtonElement> }) => React.ReactElement;
