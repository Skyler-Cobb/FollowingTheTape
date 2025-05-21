import React from 'react'
import {assetUrl} from "../lib/assetUrl.js";

/**
 *  • fixed h-24        →    6 rem (≈ 96 px) regardless of viewport width
 *  • w-full            →    always fills the row
 *  • object-cover      →    keeps aspect ratio & crops both top AND bottom
 *  • object-center     →    ensures the crop is symmetrical
 */
export default function Banner() {
    return (
        <img
            src={assetUrl('/assets/banner.jpg')}
            alt="Following The Tapes banner"
            className="h-24 w-full object-cover object-center select-none"
            draggable={false}
        />
    )
}
