/*
options: Object
 - levels: list of integers representing heading levels. Defaults to [1, 2]
 - target_id: ID of the elemnt that will contain the TOC. Default to "toc"
 - toc_container_tag: The outer element that will contain the TOC. Default to "ol"
 - toc_item_tag: The element that each TOC item resides in. Default to "li"
*/

function toc(options={}) {
    /* Handle Default options */
    if (!options.hasOwnProperty('levels')) {
        options['levels'] = [1, 2]
    }
    if (!options.hasOwnProperty('target_id')) {
        options['target_id'] = 'toc'
    }
    if (!options.hasOwnProperty('toc_container_tag')) {
        options['toc_container_tag'] = 'ol'
    }
    if (!options.hasOwnProperty('toc_item_tag')) {
        options['toc_item_tag'] = 'li'
    }

    /* get headings */
    const heading_query = options.levels.map((el) => `h${el}[id]`).join(',')
    console.log(`Heading Query: ${heading_query}`);

    const headings = document.querySelectorAll(heading_query)
    console.log(`Headings found: ${headings.length}`)

    const target_element = document.getElementById(options.target_id)
    const toc_container = document.createElement(options.toc_container_tag)

    headings.forEach((el) => {
        let toc_item = document.createElement(options.toc_item_tag)
        let link = document.createElement("a")
        link.href = `#${el.id}`
        link.innerText = el.innerText
        toc_item.append(link)
        toc_container.append(toc_item)
    })

    target_element.append(toc_container)

}