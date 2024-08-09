export interface IPageObject {
    properties: PageObjectProperties
}

interface PageObjectProperties {
    [key: string] : TitleProperty | DateProperty | SelectProperty | RelationProperty | MultiSelectProperty| CheckboxProperty
}

export interface TitleProperty {
    type?: "title",
    title: [
        {
            type?: "text",
            text: {
                content: string
            }
        }
    ]
}

export interface CheckboxProperty {
    type?: "checkbox",
    checkbox: boolean,
  }

export interface DateProperty {
    type?: "date",
    date: {
        start: string,
        } | null
}

export interface SelectProperty {
    type?: "select",
    select : {
      name: string,
    } | null
}

export interface MultiSelectProperty {
    type?: "multi_select",
    multi_select : {
      name: string,
    } []
}

export interface RelationProperty {
    type?: "relation",
    relation : {
        id : string,
    }[]
}