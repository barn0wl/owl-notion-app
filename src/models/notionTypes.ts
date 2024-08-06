export interface IPageObjectResponse {
    id: string,
    properties: PageObjectProperties
}

interface PageObjectProperties {
    Name?: TitleProperty,
    Due?: DateProperty,
    Done?: CheckboxProperty,
    Priority?: SelectProperty,
    Project?: RelationProperty,
    Schedule?: MultiSelectProperty,
    Recurring?: CheckboxProperty
}

interface TitleProperty {
    type: "title",
    title: [
        {
            type: "text",
            text: {
                content: string
            }
        }
    ]
}

interface CheckboxProperty {
    type: 'checkbox',
    checkbox: boolean,
  }

interface DateProperty {
    type: "date",
    date: {
        start: Date,
        }
}

interface SelectProperty {
    type: "select",
    select : {
      name: string,
    }
}

interface MultiSelectProperty {
    type: "multi-select",
    multi_select : {
      name: string,
    } []
}

interface RelationProperty {
    type: "relation",
    relation : {
        id : string,
    } []
}