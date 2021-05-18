Chat Composer
=========

`<ChatComposer />` is a React component for writing chat message.

This component render a contentediable div, includes media browser and quick reply messages support

## Usage

Render the component, passing the conversation as a prop:

```js
function MyComponent() {
	return <ChatComposer conversation={ conversation } />
}
```

## Props

### `conversation`

<table>
	<tr><th>Type</th><td>Object</td></tr>
	<tr><th>Required</th><td>yes</td></tr>
</table>

The conversation can be found in global state by conversation selector.
