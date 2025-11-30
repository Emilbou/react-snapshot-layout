# react-snapshot-layout

Captures the natural position of elements calculated by the browser, 
then makes them draggable with absolute positioning.

## Preview

![react-snapshot-layout demo](./assets/demo_mansonry.gif)

## The problem

CSS layouts (flexbox, grid, columns) perfectly calculate positions,
but elements remain in the flow and cannot be moved freely.

## The solution

The component first lets CSS calculate the layout naturally.
Once the render is stable, it captures each element's position.
Then it recreates these elements in absolute position with their coordinates.
From there, they become draggable.

## Use cases

Designed for interactive and creative experiences:
- Rearrangeable image galleries
- Interactive portfolios
- Web art installations
- Exploratory prototypes

## Warning

This library is experimental and not suitable for traditional websites.
It breaks standard accessibility (keyboard navigation, screen readers) 
and native responsive behavior. Use only for projects where visual/interactive 
aspects take priority over accessibility, never for informational content 
or business applications.

## Planned features

- Customizable hooks to control the transition
- Support for different component types (not just images)
- API to define which elements are movable
- Movement constraint system
- Save/restore positions