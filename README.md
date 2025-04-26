
# ReX Selector

This package is the Community plan edition of the Selector components. It's part of Rex, an open-core extension of our Core libraries, with advanced components.





## Installation

Install the package in your project directory with:

```bash
npm i craft-rex-selector
```
## Usage/Examples

```javascript
import  RexSelector  from 'craft-rex-selector';

function App() {
  return <RexSelector />
}
```


## License

[Digital Craft]('')

| Prop                   | defaultValue        | Types                                                                                                                      
|------------------------|---------------------|----------------------------------------------------------------------------------------------------------------------------|
| labelColor             | #000                | string                                                                                                                     
| px                     | 10px                | string                                                                                                                     
| py                     | 4px                 | string                                                                                                                     
| selectorColor          | #000                | string                                                                                                                     
| optionsTextColor       | #000                | string                                                                                                                     
| selectedColor          | #a2e1e1             | string                                                                                                                     
| borderWidth            | 1px                 | string                                                                                                                     
| borderStyle            | solid               | string                                                                                                                     
| borderRadius           | 10px                | string                                                                                                                     
| selectedColorArray     | #92e0f9             | string                                                                                                                     
| searchColor            | #000                | string                                                                                                                     
| optionsSize            | 50px                | string                                                                                                                     
| containerOptionsRadius | 5px                 | string                                                                                                                     
| colorHovered           | #f0f0f0             | string                                                                                                                     
| defaultValues          |                     | string                                                                                                                     
| search                 | false               | boolean                                                                                                                    
| label                  | Select ...          | string                                                                                                                     
| value                  |                     | string                                                                                                                     
| apiFn                  |                     | (page: number, search: string) => Promise<any>                                                                             
| apiUrl                 |                     | string                                                                                                                     
| array                  |                     | any[]                                                                                                                      
| KeyShowFn              | (item: any) => item | (item: any) => string                                                                                                      
| getValue               |                     | (item: any) => any                                                                                                         
| multiSelect            | false               | boolean                                                                                                                    
| closeOnSelect          | true                | boolean                                                                                                                    
| nameFormHook           |                     | string                                                                                                                     
| setValueFormHook       |                     | name: TFieldName, value: TValue,options?: { shouldValidate?: boolean;   shouldDirty?: boolean; shouldTouch?: boolean;    } 