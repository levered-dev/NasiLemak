# Validation

The automated game tests cover the complete seven-step journey, blocked out-of-order actions, duplicate ingredients, accelerated cooking timers, washing, cutting, plating completeness, and reset. The generated six-part dish asset is checked for finite 3D geometry and matching vertex colors.

Browser UI testing was not requested and was not performed. The local preview was opened after a successful HTTP response. WebMCP is feature-detected and optional; no supported live WebMCP validation context was available, so its two tools were not verified in a live registry. This does not affect the visible game controls.

Cooking is a simplified educational simulation. Game timers are accelerated and visibly labelled. Layouts are session-local and reset when the page is reloaded.
