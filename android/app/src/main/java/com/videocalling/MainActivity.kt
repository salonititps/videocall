package com.videocalling

import android.content.res.Configuration
import android.os.Build
import androidx.lifecycle.Lifecycle
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate
import com.streamvideo.reactnative.StreamVideoReactNative

class MainActivity : ReactActivity() {

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    override fun getMainComponentName(): String = "VideoCalling"

    /**
     * Returns the instance of the [ReactActivityDelegate].
     * Uses [DefaultReactActivityDelegate] to easily enable the New Architecture.
     */
    override fun createReactActivityDelegate(): ReactActivityDelegate {
        return DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)
    }

    /**
     * Handles changes when the app enters or exits Picture-in-Picture (PiP) mode.
     */
      override fun onPictureInPictureModeChanged(
          isInPictureInPictureMode: Boolean,
          newConfig: Configuration
      ) {
          super.onPictureInPictureModeChanged(isInPictureInPictureMode, newConfig)
          
          if (lifecycle.currentState == Lifecycle.State.CREATED) {
              // when user clicks on Close button of PIP
              finishAndRemoveTask()
          } else {
              StreamVideoReactNative.onPictureInPictureModeChanged(isInPictureInPictureMode, newConfig)
          }
      }

    /**
     * Called when the user is about to leave the activity (e.g., presses Home button).
     * Automatically enters PiP mode if supported and allowed.
     */
    override fun onUserLeaveHint() {
        if (Build.VERSION.SDK_INT in Build.VERSION_CODES.O until Build.VERSION_CODES.S &&
            StreamVideoReactNative.canAutoEnterPictureInPictureMode
        ) {
            val config = resources.configuration
            onPictureInPictureModeChanged(true, config)
        }
    }
}
