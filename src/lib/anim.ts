import { circInOut, cubicOut } from "svelte/easing";
import type { TransitionConfig } from "svelte/transition";

export function slidefade(node:any):TransitionConfig {
    const existingTransform = getComputedStyle(node).transform.replace('none', '');

    return {
        delay: 200,
        duration: 700,
        easing: cubicOut,
        css: (t, u) => `transform-origin: bottom left; transform: ${existingTransform} scaleY(${t}); opacity: ${t};`
    };
}

export  function flySlide(node:Element,{ delay = 0,easing=circInOut, duration = 400, axis = 'y',x = 1500, y = 0 } = {}):TransitionConfig{
    const style = getComputedStyle(node);

    const primary_property = axis === 'y' ? 'height' : 'width';
    const primary_property_value:number = parseFloat(style[primary_property]);
    const secondary_properties:string[] = axis === 'y' ? ['top', 'bottom'] : ['left', 'right'];
    const capitalized_secondary_properties:any[] = secondary_properties.map(
        (e) => /** @type {'Left' | 'Right' | 'Top' | 'Bottom'} */ (`${e[0].toUpperCase()}${e.slice(1)}`)
    );
    const padding_start_value = parseFloat(style[`padding${capitalized_secondary_properties[0]}`]);
    const padding_end_value = parseFloat(style[`padding${capitalized_secondary_properties[1]}`]);
    const margin_start_value = parseFloat(style[`margin${capitalized_secondary_properties[0]}`]);
    const margin_end_value = parseFloat(style[`margin${capitalized_secondary_properties[1]}`]);
    const border_width_start_value = parseFloat(
        style[`border${capitalized_secondary_properties[0]}Width`]
    );
    const border_width_end_value = parseFloat(
        style[`border${capitalized_secondary_properties[1]}Width`]
    );
    return {
        duration,
        easing,
        css: (t, u) => `
        transform: translate(${u*x}px,${u*y}px);	
        ${primary_property}: ${t * primary_property_value}px;
        padding-${secondary_properties[0]}: ${t * padding_start_value}px;
        padding-${secondary_properties[1]}: ${t * padding_end_value}px;
        margin-${secondary_properties[0]}: ${t * margin_start_value}px;
        margin-${secondary_properties[1]}: ${t * margin_end_value}px;
        border-${secondary_properties[0]}-width: ${t * border_width_start_value}px
        border-${secondary_properties[1]}-width: ${t * border_width_end_value}px;`
    }
}
export function scaleSlide(
	node,
	{ delay = 0, duration = 400, easing = cubicOut, start = 0, opacity = 0,axis="y" } = {}
) {
    const style = getComputedStyle(node);
	const target_opacity = +style.opacity;
	const transform = style.transform === 'none' ? '' : style.transform;
	const sd = 1 - start;
	const od = target_opacity * (1 - opacity);
    const primary_property = axis === 'y' ? 'height' : 'width';
    const primary_property_value:number = parseFloat(style[primary_property]);
    const secondary_properties:string[] = axis === 'y' ? ['top', 'bottom'] : ['left', 'right'];
    const capitalized_secondary_properties:any[] = secondary_properties.map(
        (e) => /** @type {'Left' | 'Right' | 'Top' | 'Bottom'} */ (`${e[0].toUpperCase()}${e.slice(1)}`)
    );
    const padding_start_value = parseFloat(style[`padding${capitalized_secondary_properties[0]}`]);
    const padding_end_value = parseFloat(style[`padding${capitalized_secondary_properties[1]}`]);
    const margin_start_value = parseFloat(style[`margin${capitalized_secondary_properties[0]}`]);
    const margin_end_value = parseFloat(style[`margin${capitalized_secondary_properties[1]}`]);
    const border_width_start_value = parseFloat(
        style[`border${capitalized_secondary_properties[0]}Width`]
    );
    const border_width_end_value = parseFloat(
        style[`border${capitalized_secondary_properties[1]}Width`]
    );
    return {
        duration,
        easing,
        css: (t, u) => `

	    transform: ${transform} scale(${1 - sd * u});
    	opacity: ${target_opacity - od * u}
        ${primary_property}: ${t * primary_property_value}px;
        padding-${secondary_properties[0]}: ${t * padding_start_value}px;
        padding-${secondary_properties[1]}: ${t * padding_end_value}px;
        margin-${secondary_properties[0]}: ${t * margin_start_value}px;
        margin-${secondary_properties[1]}: ${t * margin_end_value}px;
        border-${secondary_properties[0]}-width: ${t * border_width_start_value}px
        border-${secondary_properties[1]}-width: ${t * border_width_end_value}px;`
    }
}