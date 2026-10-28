/*
===============================================================
PUSHING/RUNNING A CUSTOM SINGLE TRIAL (*singleTrial)
===============================================================
*/
function runSingleTrial(
    stimDarkLocation,
    stimDuration,
    timelineTrialsToPush,
    trialType,
) {

    /*--------------------------- General Utility ---------------------------*/
    var checkScreen = {
        type: jsPsychFullscreen,
        message:
            '<p>Unfortunately, it appears you are no longer in fullscreen mode. Please make sure to remain in fullscreen mode. <br>Click on the button to fullscreen the experiment again and proceed.</p>',
        fullscreen_mode: true,
        button_label: 'Resume',
    };

    var if_notFull = {
        timeline: [checkScreen],
        conditional_function: function () {
            if (full_check == false) {
                return true;
            } else {
                return false;
            }
        },
    };

    var cursor_off = {
        type: jsPsychCallFunction,
        func: function () {
            document.body.style.cursor = 'none';
        },
    };

    var cursor_on = {
        type: jsPsychCallFunction,
        func: function () {
            document.body.style.cursor = 'auto';
        },
    };

    /*--------------------------- Experiment specific variables ---------------------------*/
    var stimName = String(stimDarkLocation) === '3' ? 'three' : 'five';
    var thisStim = `${stimFolder}${stimName}OffBase2.png`;
    var thisMask = `${stimFolder}${stimName}OffBase2_mask.png`;
    var leftSliderImage = `${stimFolder}dayRoad_short.png`;
    var rightSliderImage = `${stimFolder}dayRoad_long.png`;
    var persistent_prompt = `<div style="position: fixed; top: 50px; left: 50%; transform: translateX(-50%); text-align: center;"></div>`;

    var displayRandomizedImage = {
        type: jsPsychHtmlKeyboardResponse,
        stimulus: `
            <div style="
                position: fixed;
                inset: 0;
                display: flex;
                justify-content: center;
                align-items: center;
            ">
                <img src="${thisStim}" style="
                    width: ${imgWidth}px;
                    height: ${imgHeight}px;
                    object-fit: contain;
                " />
            </div>
        `,
        choices: "NO_KEYS",
        trial_duration: stimDuration,
        data: {
            trial_category: 'stimulus' + trialType,
            trial_stimulus: thisStim,
            stimulus_condition: stimDarkLocation,
            stimulus_duration: stimDuration,
        },
    };

    var mask = {
        type: jsPsychHtmlKeyboardResponse,
        stimulus: `
            <div style="
                position: fixed;
                inset: 0;
                display: flex;
                justify-content: center;
                align-items: center;
            ">
                <img src="${thisMask}" style="
                    width: 85vw;
                    max-height: 85vh;
                    object-fit: contain;
                " />
            </div>
        `,
        choices: "NO_KEYS",
        trial_duration: MASK_DISP_TIME,
        data: {
            trial_category: 'mask' + trialType,
            trial_stimulus: thisMask,
            mask_duration: MASK_DISP_TIME,
        },
    };

    var prestim = {
        type: jsPsychHtmlKeyboardResponse,
        stimulus: `${persistent_prompt}`,
        choices: "NO_KEYS",
        trial_duration: PRESTIM_DISP_TIME,
        data: {
            trial_category: 'prestim_ISI' + trialType,
        }
    };

    var dispSlider = {
        type: jsPsychSurveyHtmlForm,

        html: `
            <div style="width: 900px; max-width: 90vw; margin: 0 auto; text-align: center;">
                <p style="font-size: 24px; margin-bottom: 45px;">
                    <strong>How far away was the construction sign? Based on these reference images, report where the sign was by positioning the slider <b>as precisely as possible</b>.</strong>
                </p>

                <div style="display: grid; grid-template-columns: 300px 1fr 300px; align-items: center; gap: 25px;">
                    <img src="${leftSliderImage}" style="width: 300px; height: auto;" />

                    <input
                        type="range"
                        name="road_length"
                        min="0"
                        max="100"
                        step="1"
                        value="50"
                        style="width: 100%;"
                    />

                    <img src="${rightSliderImage}" style="width: 300px; height: auto;" />
                </div>
            </div>
        `,

        button_label: 'Continue',

        on_load: function () {
            const slider = document.querySelector('input[name="road_length"]');
            const button = document.querySelector('#jspsych-survey-html-form-next');

            button.disabled = true;

            slider.addEventListener('input', function () {
                button.disabled = false;
            }, { once: true });
        },

        data: {
            trial_category: 'answer' + trialType,
            trial_stimulus: thisStim,
            stimulus_condition: stimDarkLocation,
            stimulus_duration: stimDuration,
            mask_stimulus: thisMask,
        },

        on_finish: function(data) {
            data.slider_response = Number(data.response.road_length);
        },
    };

    var fixation = {
        type: jsPsychHtmlKeyboardResponse,
        stimulus: `${persistent_prompt}<div style="font-size:60px;">+</div>`,
        choices: "NO_KEYS",
        trial_duration: FIXATION_DISP_TIME,
        data: {
            trial_category: 'fixation' + trialType,
        }
    };


    /*--------------------------- push single trial sequence ---------------------------*/

    timelineTrialsToPush.push(if_notFull);
    timelineTrialsToPush.push(cursor_off);
    timelineTrialsToPush.push(prestim);
    timelineTrialsToPush.push(fixation);
    timelineTrialsToPush.push(displayRandomizedImage);
    timelineTrialsToPush.push(mask);
    timelineTrialsToPush.push(cursor_on);
    timelineTrialsToPush.push(dispSlider);
   

}