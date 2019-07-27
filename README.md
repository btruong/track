# track
Event tracking library

# Dependencies
    - core/drupalSettings
    - core/jquery
    
# Instructions
Load track_lib.js first, then in a seperate .js file, run the lines of code found in example.js.

# Usage

## Track clicks on elements that link to another page

```php
<a data-track="track-link" data-object="Link" data-action="Clicked" data-description="View Menu" data-cuisine="Italian" data-neighborhood="Sherman Oaks">
  View Menu
</a>

```

## Track clicks on interactive elements that do not link to another page

```php
<button data-track="click" data-object="Button" data-action="Clicked" data-description="Hamburger Menu">
  View Menu
</button>

```

## Track changes on dropdown

```php
<select data-track="dropdown" data-object="Dropdown" data-action="Changed" data-description="Neighborhood">...</select>
```

## Track text input

```php
<input data-track="textfield_focusout" data-send-input-value="1" data-object="Textfield" data-action="Entered" data-description="Textfield">
```

```php
data-send-input-value="1"
```

This setting will include the value of the text entered in the event call under the parameter "value"
